import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const proposals = await prisma.songProposal.findMany({
      include: {
        user: true, // Include the related User model
        likesByUsers: {
          select: {
            userId: true,
          },
        },
      },
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
