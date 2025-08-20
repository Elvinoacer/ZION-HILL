import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, ministryId } = await request.json();

    if (!userId || !ministryId) {
      return NextResponse.json(
        { message: "User ID and Ministry ID are required." },
        { status: 400 }
      );
    }

    // Check if a request already exists for this user and ministry
    const existingRequest = await prisma.ministryJoinRequest.findUnique({
      where: {
        userId_ministryId: {
          userId,
          ministryId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "You have already sent a request to join this ministry." },
        { status: 409 } // Conflict
      );
    }

    const newJoinRequest = await prisma.ministryJoinRequest.create({
      data: {
        userId,
        ministryId,
        status: "PENDING",
      },
    });

    return NextResponse.json(newJoinRequest, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ministry join request:", error);
    return NextResponse.json(
      { message: "Failed to send join request", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const ministryId = searchParams.get("ministryId");
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (ministryId) whereClause.ministryId = ministryId;
    if (status) whereClause.status = status;

    const joinRequests = await prisma.ministryJoinRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        ministry: { select: { id: true, name: true } },
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(joinRequests);
  } catch (error: any) {
    console.error("Error fetching ministry join requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch join requests", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Request ID and status are required." },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.ministryJoinRequest.update({
      where: { id },
      data: { status },
    });

    // If request is approved, add the user to MinistryMember
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
    return NextResponse.json(
      { message: "Failed to update join request", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Request ID is required." },
        { status: 400 }
      );
    }

    await prisma.ministryJoinRequest.delete({ where: { id } });
    return NextResponse.json({ message: "Join request deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting ministry join request:", error);
    return NextResponse.json(
      { message: "Failed to delete join request", error: error.message },
      { status: 500 }
    );
  }
}
