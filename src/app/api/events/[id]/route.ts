import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        date: new Date(data.date),
        location: data.location,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        ministryId: data.ministryId,
        time: data.time,
        capacity: data.capacity,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
