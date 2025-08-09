import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { eventId, userId, status } = body; // Destructure eventId, userId, status

  if (!eventId || !userId || !status) {
    return NextResponse.json({ error: "Missing required fields: eventId, userId, status" }, { status: 400 });
  }

  try {
    // 1. Get Event Capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { capacity: true }, // Select only capacity
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 2. Count Current RSVPs
    const currentRsvps = await prisma.participant.count({
      where: { eventId: eventId },
    });

    // 3. Compare with Capacity
    // Assuming capacity is stored as an integer and 0 means unlimited or not set
    if (event.capacity && event.capacity > 0 && currentRsvps >= event.capacity) {
      return NextResponse.json({ error: "Event capacity reached" }, { status: 409 }); // 409 Conflict
    }

    // Check if user has already RSVP'd to this specific event
    const existingRsvp = await prisma.participant.findFirst({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (existingRsvp) {
      return NextResponse.json({ error: "You have already RSVP'd to this event." }, { status: 409 });
    }

    // 4. Create RSVP
    const newRsvp = await prisma.participant.create({
      data: {
        eventId,
        userId,
        status,
      },
    });
    return NextResponse.json(newRsvp, { status: 201 });
  } catch (error) {
    console.error("Error creating RSVP:", error);
    return NextResponse.json({ error: "Error creating RSVP" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const rsvps = await prisma.participant.findMany({
      where: { eventId },
      include: { // Include the related User model
        user: {
          select: { // Select specific fields from User
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error("Error fetching RSVPs:", error); // Add console.error for debugging
    return NextResponse.json(
      { error: "Error fetching RSVPs" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
  }

  try {
    const updatedRsvp = await prisma.participant.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedRsvp);
  } catch (error) {
    return NextResponse.json({ error: "Error updating RSVP" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
  }

  try {
    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ message: "RSVP deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting RSVP" }, { status: 500 });
  }
}
