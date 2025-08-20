import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const userId = searchParams.get("userId");

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    if (userId) {
      // Check RSVP status for a single user
      const existingParticipant = await prisma.participant.findFirst({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });
      return NextResponse.json({ rsvpd: !!existingParticipant });
    } else {
      // Fetch all participants for the event
      const participants = await prisma.participant.findMany({
        where: {
          eventId: eventId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json(participants);
    }
  } catch (error) {
    console.error("Error handling RSVP GET request:", error);
    return NextResponse.json(
      { error: "Error handling RSVP GET request" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { eventId, userId } = await request.json();

  if (!eventId || !userId) {
    return NextResponse.json(
      { error: "Event ID and User ID are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the participant already exists for this event and user
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: "User has already RSVP'd to this event" }, // Changed message to error
        { status: 409 } // Changed status to 409 Conflict
      );
    }

    const newParticipant = await prisma.participant.create({
      data: {
        eventId: eventId,
        userId: userId,
        status: "RSVP", // Or any other default status you prefer
      },
    });
    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    return NextResponse.json(
      { error: "Error RSVPing to event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { eventId, userId } = await request.json();

  if (!eventId || !userId) {
    return NextResponse.json(
      { error: "Event ID and User ID are required" },
      { status: 400 }
    );
  }

  try {
    const participantToDelete = await prisma.participant.findFirst({
        where: {
            eventId: eventId,
            userId: userId,
        }
    });

    if (!participantToDelete) {
        return NextResponse.json(
            { error: "RSVP not found" },
            { status: 404 }
        );
    }

    await prisma.participant.delete({
      where: {
        id: participantToDelete.id
      },
    });

    return NextResponse.json({ message: "RSVP cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    return NextResponse.json(
      { error: "Error cancelling RSVP" },
      { status: 500 }
    );
  }
}
