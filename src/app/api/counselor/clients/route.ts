import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const counselorId = searchParams.get("counselorId");

  if (!counselorId) {
    return NextResponse.json({ error: "Counselor ID is required" }, { status: 400 });
  }

  try {
    const sessions = await prisma.counselingSession.findMany({
      where: {
        counselorId: counselorId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Extract unique clients from the sessions
    const clientsMap = new Map();
    sessions.forEach((session) => {
      if (session.client) {
        clientsMap.set(session.client.id, session.client);
      }
    });

    const clients = Array.from(clientsMap.values());

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching counselor's clients:", error);
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
  }
}
