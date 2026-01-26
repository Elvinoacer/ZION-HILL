import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@/generated/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { eventId, userId, status } = body;

  if (!eventId || !userId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Security: users can only RSVP for themselves unless they are Admin/Manager
  if (userId !== session.user.id && !session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.EVENTS_MANAGER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { capacity: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentRsvps = await prisma.participant.count({
      where: { eventId: eventId },
    });

    if (event.capacity && parseInt(event.capacity) > 0 && currentRsvps >= parseInt(event.capacity)) {
      return NextResponse.json({ error: "Event capacity reached" }, { status: 409 });
    }

    const existingRsvp = await prisma.participant.findFirst({
      where: { eventId, userId },
    });

    if (existingRsvp) {
      return NextResponse.json({ error: "You have already RSVP'd to this event." }, { status: 409 });
    }

    const newRsvp = await prisma.participant.create({
      data: { eventId, userId, status },
    });
    return NextResponse.json(newRsvp, { status: 201 });
  } catch (error) {
    console.error("Error creating RSVP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');

  const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.EVENTS_MANAGER);

  // Security: users can only fetching for themselves or be Admin/Manager for eventId queries
  if (userId && userId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (eventId && !isAdmin) {
      // If a non-admin queries by eventId, return only THEIR rsvp for that event
      const rsvp = await prisma.participant.findFirst({
          where: { eventId, userId: session.user.id },
          include: { user: { select: { id: true, name: true } } }
      });
      return NextResponse.json(rsvp ? [rsvp] : []);
  }

  try {
    let whereClause: any = {};
    if (eventId) whereClause.eventId = eventId;
    if (userId) whereClause.userId = userId;

    if (!eventId && !userId) {
        // If no filter, only admins see all, others see their own
        if (!isAdmin) whereClause.userId = session.user.id;
    }

    const rsvps = await prisma.participant.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: isAdmin, // Only admins get email
          },
        },
      },
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
  }

  try {
    const existingRsvp = await prisma.participant.findUnique({
        where: { id },
        select: { userId: true }
    });

    if (!existingRsvp) {
        return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }

    const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.EVENTS_MANAGER);

    if (existingRsvp.userId !== session.user.id && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedRsvp = await prisma.participant.update({
      where: { id },
      data: { status: body.status }, // Only allow status updates
    });
    return NextResponse.json(updatedRsvp);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
  }

  try {
    const existingRsvp = await prisma.participant.findUnique({
        where: { id },
        select: { userId: true }
    });

    const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.EVENTS_MANAGER);

    if (existingRsvp && existingRsvp.userId !== session.user.id && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ message: "RSVP deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
