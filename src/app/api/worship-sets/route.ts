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
  const { title, date, arrangedSongs } = body;

  if (!title || !date || !arrangedSongs) {
    return NextResponse.json(
      { error: "Title, date, and arrangedSongs are required" },
      { status: 400 }
    );
  }

  try {
    const newWorshipSet = await prisma.worshipSet.create({
      data: {
        title,
        date: new Date(date),
        leaderId: session.user.id,
        arrangedSongs,
      },
    });
    return NextResponse.json(newWorshipSet, { status: 201 });
  } catch (error: any) {
    console.error("Error creating worship set:", error.message);
    return NextResponse.json(
      { error: "Failed to create worship set" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leaderId = searchParams.get("leaderId");
  const date = searchParams.get("date");

  try {
    let whereClause: any = {};
    if (leaderId) {
      whereClause.leaderId = leaderId;
    }
    if (date) {
      // Assuming date is in YYYY-MM-DD format for filtering by day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const worshipSets = await prisma.worshipSet.findMany({
      where: whereClause,
      include: {
        leader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(worshipSets);
  } catch (error: any) {
    console.error("Error fetching worship sets:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch worship sets" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Worship Set ID is required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { title, date, arrangedSongs } = body;

  try {
    const existingWorshipSet = await prisma.worshipSet.findUnique({
      where: { id },
    });

    if (!existingWorshipSet) {
      return NextResponse.json(
        { error: "Worship Set not found" },
        { status: 404 }
      );
    }

    // Authorization: Only the leader who created it or an Admin can update
    const isAdmin = session.user.roles?.includes("Admin");
    const isLeader = existingWorshipSet.leaderId === session.user.id;

    if (!isAdmin && !isLeader) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to update this worship set",
        },
        { status: 403 }
      );
    }

    const updatedWorshipSet = await prisma.worshipSet.update({
      where: { id },
      data: {
        title: title || existingWorshipSet.title,
        date: date ? new Date(date) : existingWorshipSet.date,
        arrangedSongs: arrangedSongs || existingWorshipSet.arrangedSongs,
      },
    });
    return NextResponse.json(updatedWorshipSet);
  } catch (error: any) {
    console.error("Error updating worship set:", error.message);
    return NextResponse.json(
      { error: "Failed to update worship set" },
      { status: 500 }
    );
  }
}
