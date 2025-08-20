import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prayerRequests = await prisma.prayerRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(prayerRequests);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
