import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { RoleName } from "@prisma/client";

// Helper for RBAC
async function isAdminOrCoordinator(session: any) {
  if (!session?.user?.roles) return false;
  return session.user.roles.includes(RoleName.ADMIN) || 
         session.user.roles.includes(RoleName.SENIOR_PASTOR) || 
         session.user.roles.includes(RoleName.OVERALL_MINISTRIES_COORDINATOR);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, ministryId } = await request.json();

    if (!userId || !ministryId) {
      return NextResponse.json({ message: "User ID and Ministry ID are required." }, { status: 400 });
    }

    // Security check: Only the user themselves or an admin can create a join request for them
    if (userId !== session.user.id && !(await isAdminOrCoordinator(session))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingRequest = await prisma.ministryJoinRequest.findUnique({
      where: { userId_ministryId: { userId, ministryId } },
    });

    if (existingRequest) {
      return NextResponse.json({ message: "You have already sent a request to join this ministry." }, { status: 409 });
    }

    const newJoinRequest = await prisma.ministryJoinRequest.create({
      data: { userId, ministryId, status: "PENDING" },
    });

    return NextResponse.json(newJoinRequest, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ministry join request:", error);
    return NextResponse.json({ message: "Failed to send join request" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let userId = searchParams.get("userId");
  const ministryId = searchParams.get("ministryId");
  const status = searchParams.get("status");

  const isPrivileged = await isAdminOrCoordinator(session);

  // Privacy logic: Generic users can only see their own requests.
  if (!isPrivileged) {
      // If not admin, they are forced to only see their own requests
      userId = session.user.id;
  }

  try {
    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (ministryId) whereClause.ministryId = ministryId;
    if (status) whereClause.status = status;

    const joinRequests = await prisma.ministryJoinRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: isPrivileged, photo: true } }, // Sanitized email
        ministry: { select: { id: true, name: true } },
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(joinRequests);
  } catch (error: any) {
    console.error("Error fetching ministry join requests:", error);
    return NextResponse.json({ message: "Failed to fetch join requests" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isAdminOrCoordinator(session))) {
    return NextResponse.json({ message: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Request ID and status are required." }, { status: 400 });
    }

    const updatedRequest = await prisma.ministryJoinRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "APPROVED") {
      const joinRequest = await prisma.ministryJoinRequest.findUnique({
        where: { id },
        select: { userId: true, ministryId: true },
      });

      if (joinRequest) {
        await prisma.ministryMember.upsert({
          where: { ministryId_userId: { ministryId: joinRequest.ministryId, userId: joinRequest.userId } },
          update: { active: true },
          create: { ministryId: joinRequest.ministryId, userId: joinRequest.userId, active: true },
        });
      }
    }

    return NextResponse.json(updatedRequest);
  } catch (error: any) {
    console.error("Error updating ministry join request:", error);
    return NextResponse.json({ message: "Failed to update join request" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Request ID is required." }, { status: 400 });
    }

    const targetRequest = await prisma.ministryJoinRequest.findUnique({ where: { id } });
    if (!targetRequest) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Only the owner can cancel (delete) or an admin
    if (targetRequest.userId !== session.user.id && !(await isAdminOrCoordinator(session))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.ministryJoinRequest.delete({ where: { id } });
    return NextResponse.json({ message: "Join request deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting ministry join request:", error);
    return NextResponse.json({ message: "Failed to delete join request" }, { status: 500 });
  }
}
