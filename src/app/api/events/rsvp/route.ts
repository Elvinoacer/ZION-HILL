import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        { message: "User already RSVPd to this event" },
        { status: 200 }
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
