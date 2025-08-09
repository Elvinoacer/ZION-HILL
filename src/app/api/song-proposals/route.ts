import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const proposals = await prisma.songProposal.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching song proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch song proposals" },
      { status: 500 }
    );
  }
}
