import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, ministryId, role } = body;

  if (!userId || !ministryId) {
    return NextResponse.json(
      { error: "User ID and Ministry ID are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the user is already a member of this ministry
    const existingMember = await prisma.ministryMember.findUnique({
      where: {
        ministryId_userId: {
          userId: userId,
          ministryId: ministryId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this ministry" },
        { status: 409 }
      );
    }

    const newMinistryMember = await prisma.ministryMember.create({
      data: {
        userId,
        ministryId,
        role: role || "Member",
      },
    });
    return NextResponse.json(newMinistryMember, { status: 201 });
  } catch (error: any) {
    console.error("Error adding ministry member:", error.message);
    return NextResponse.json(
      { error: "Failed to add ministry member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const ministryId = searchParams.get("ministryId");

  if (!userId || !ministryId) {
    return NextResponse.json(
      { error: "User ID and Ministry ID are required" },
      { status: 400 }
    );
  }

  try {
    // Authorization: Only the user themselves, or an Admin, or the Ministry Leader can remove
    const ministryMember = await prisma.ministryMember.findUnique({
      where: {
        ministryId_userId: {
          userId: userId,
          ministryId: ministryId,
        },
      },
      include: {
        ministry: {
          select: { leaderId: true },
        },
      },
    });

    if (!ministryMember) {
      return NextResponse.json(
        { error: "Ministry member not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.roles?.includes("Admin");
    const isSelf = session.user.id === userId;
    const isMinistryLeader =
      ministryMember.ministry?.leaderId === session.user.id;

    if (!isAdmin && !isSelf && !isMinistryLeader) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to remove this member",
        },
        { status: 403 }
      );
    }

    await prisma.ministryMember.delete({
      where: {
        ministryId_userId: {
          userId: userId,
          ministryId: ministryId,
        },
      },
    });
    return NextResponse.json({
      message: "Ministry member removed successfully",
    });
  } catch (error: any) {
    console.error("Error removing ministry member:", error.message);
    return NextResponse.json(
      { error: "Failed to remove ministry member" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ministryId = searchParams.get("ministryId");

  if (!ministryId) {
    return NextResponse.json(
      { error: "Ministry ID is required" },
      { status: 400 }
    );
  }

  try {
    const ministryMembers = await prisma.ministryMember.findMany({
      where: { ministryId: ministryId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });
    return NextResponse.json(ministryMembers);
  } catch (error: any) {
    console.error("Error fetching ministry members:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch ministry members" },
      { status: 500 }
    );
  }
}
