import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EventType } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const eventType = searchParams.get("type");
  const take = searchParams.get("limit");

  try {
    if (id) {
      // Fetch a single event by ID
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          participants: true,
        },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      return NextResponse.json(event);
    } else {
      // Fetch multiple events based on type or limit
      const events = await prisma.event.findMany({
        where: eventType ? { type: eventType as EventType } : {},
        orderBy: {
          date: "asc",
        },
        take: take ? parseInt(take, 10) : undefined,
        include: {
          participants: true,
        },
      });
      return NextResponse.json(events);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let ministryId = body.ministryId;
    const {
      title,
      type,
      date,
      location,
      tags,

      groupId,
      description,
      imageUrl,
      latitude,
      longitude,
      time,
      capacity,
    } = body;

    console.log("Received POST body for event creation:", body);

    // Basic validation
    if (!title || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields: title, type, date" },
        { status: 400 }
      );
    }

    // Ensure type is a valid EventType enum member
    if (!Object.values(EventType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    // If ministryId is not provided and the event type is SERVICE, try to find the 'Worship' ministry and assign its ID
    if (!ministryId && type === "SERVICE") {
      const worshipMinistry = await prisma.ministry.findFirst({
        where: { name: "Worship" }, // Assuming the worship ministry is named "Worship"
      });
      if (worshipMinistry) {
        ministryId = worshipMinistry.id;
      } else {
        console.warn(
          "Worship ministry not found. Service will be created without a ministryId."
        );
      }
    }

    const eventDate = new Date(date);
    // Set hours, minutes, seconds, milliseconds to 0 for date-only comparison
    eventDate.setUTCHours(0, 0, 0, 0);

    // Check for existing events on the same date
    const existingEvent = await prisma.event.findFirst({
      where: {
        date: {
          gte: eventDate, // Greater than or equal to the start of the day
          lt: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000), // Less than the start of the next day
        },
      },
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: "An event already exists on this date." },
        { status: 409 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        type: type as EventType,
        date: eventDate,
        location,
        tags: tags || [],
        ministryId,
        groupId,
        description,
        imageUrl,
        latitude,
        longitude,
        time, // Add time
        capacity: capacity ? JSON.stringify(capacity) : "",
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const {
      title,
      type,
      date,
      location,
      tags,
      ministryId,
      groupId,
      description,
      imageUrl,
      capacity,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }
    console.log("Received PUT body for event update:", body);

    // Basic validation
    if (!title || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields: title, type, date" },
        { status: 400 }
      );
    }

    // Ensure type is a valid EventType enum member
    if (!Object.values(EventType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        type: type as EventType,
        date: new Date(date),
        location,
        tags: tags || [],
        ministryId,
        groupId,
        description,
        imageUrl,
        capacity: capacity ? JSON.stringify(capacity) : "",
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
