import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    // Fetch a single ministry by ID
    try {
      const ministry = await prisma.ministry.findUnique({
        where: { id },
        include: {
          leader: { select: { id: true, name: true } },
          members: {
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true },
              },
            },
          },
          events: true,
          groups: true,
        },
      });

      if (!ministry) {
        return NextResponse.json(
          { error: "Ministry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(ministry);
    } catch (error) {
      console.error("Error fetching ministry:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    // Fetch a paginated list of ministries
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    try {
      const [ministries, totalMinistries] = await prisma.$transaction([
        prisma.ministry.findMany({
          select: {
            id: true,
            name: true,
            photo: true,
            description: true,
            leader: { select: { id: true, name: true } },
            _count: { select: { members: true } },
          },
          skip,
          take: pageSize,
        }),
        prisma.ministry.count(),
      ]);

      return NextResponse.json({ ministries, totalMinistries, page, pageSize });
    } catch (error) {
      console.error("Error fetching ministries:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, leaderId, photo } = await request.json();

    const newMinistry = await prisma.ministry.create({
      data: {
        name,
        description,
        leaderId,
        photo, // ✅ Save image URL
      },
    });

    return NextResponse.json(newMinistry, { status: 201 });
  } catch (error) {
    console.error("Error creating ministry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, leaderId, photo } = await request.json();

    const updatedMinistry = await prisma.ministry.update({
      where: { id },
      data: {
        name,
        description,
        leaderId,
        photo, // ✅ Save updated image URL
      },
    });

    return NextResponse.json(updatedMinistry);
  } catch (error) {
    console.error("Error updating ministry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
        { error: "Missing ministry ID" },
        { status: 400 }
      );
    }

    // Find all events related to the ministry
    const eventsToDelete = await prisma.event.findMany({
      where: { ministryId: id },
      select: { id: true },
    });
    const eventIdsToDelete = eventsToDelete.map((event) => event.id);

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Delete participants of the events
      if (eventIdsToDelete.length > 0) {
        await tx.participant.deleteMany({
          where: { eventId: { in: eventIdsToDelete } },
        });
      }

      // Now delete the ministry. The rest should cascade.
      await tx.ministry.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "Ministry deleted successfully" });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Foreign key constraint violated. Make sure all related data is deleted.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
