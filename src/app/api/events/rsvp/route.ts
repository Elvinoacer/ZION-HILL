import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const userId = searchParams.get("userId");

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId) {
      // Privacy: Users can only check themselves unless Admin/Manager
      if (
        userId !== session.user.id &&
        !session.user.roles?.includes(RoleName.ADMIN) &&
        !session.user.roles?.includes(RoleName.EVENTS_MANAGER)
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const existingParticipant = await prisma.participant.findFirst({
        where: { eventId, userId },
      });
      return NextResponse.json({ rsvpd: !!existingParticipant });
    } else {
      // RBAC: Only Admins/Managers can see all participants
      if (
        !session.user.roles?.includes(RoleName.ADMIN) &&
        !session.user.roles?.includes(RoleName.EVENTS_MANAGER)
      ) {
        return NextResponse.json(
          { error: "Forbidden: Administrative access required" },
          { status: 403 }
        );
      }

      const participants = await prisma.participant.findMany({
        where: { eventId },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });
      return NextResponse.json(participants);
    }
  } catch (error) {
    console.error("Error handling RSVP GET request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, userId } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Event ID and User ID are required" },
        { status: 400 }
      );
    }

    // Security: Users can only RSVP for themselves unless Admin
    if (
      userId !== session.user.id &&
      !session.user.roles?.includes(RoleName.ADMIN)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingParticipant = await prisma.participant.findFirst({
      where: { eventId, userId },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: "User has already RSVP'd to this event" },
        { status: 409 }
      );
    }

    const newParticipant = await prisma.participant.create({
      data: {
        eventId,
        userId,
        status: "RSVP",
      },
    });
    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, userId } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Event ID and User ID are required" },
        { status: 400 }
      );
    }

    // Security: Users can only cancel for themselves unless Admin
    if (
      userId !== session.user.id &&
      !session.user.roles?.includes(RoleName.ADMIN)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const participantToDelete = await prisma.participant.findFirst({
      where: { eventId, userId },
    });

    if (!participantToDelete) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }

    await prisma.participant.delete({
      where: { id: participantToDelete.id },
    });

    return NextResponse.json(
      { message: "RSVP cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
