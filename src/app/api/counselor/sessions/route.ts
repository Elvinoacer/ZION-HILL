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
        topic: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc", // Order by date, upcoming first
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching counselor's sessions:", error);
    return NextResponse.json({ error: "Error fetching sessions" }, { status: 500 });
  }
}
