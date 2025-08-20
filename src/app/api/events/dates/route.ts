import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        date: true,
      },
    });

    const dates = events.map((event) => event.date);

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching event dates:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
