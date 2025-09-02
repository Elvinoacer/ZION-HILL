import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const givingOpportunities = await prisma.giving.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(givingOpportunities);
  } catch (error) {
    console.error("Error fetching giving opportunities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
