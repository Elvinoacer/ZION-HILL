import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ministries = await prisma.ministry.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(ministries);
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministries" },
      { status: 500 }
    );
  }
}
