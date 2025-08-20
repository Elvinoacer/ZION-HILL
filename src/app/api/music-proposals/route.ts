import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, artist, youtubeUrl, spotifyUrl, userId } = body;

  if (!title || !artist || !userId) {
    return NextResponse.json(
      { error: "Title, artist, and userId are required" },
      { status: 400 }
    );
  }

  try {
    const newProposal = await prisma.songProposal.create({
      data: {
        title,
        artist,
        youtubeUrl,
        spotifyUrl,
        userId,
      },
    });
    return NextResponse.json(newProposal, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting music proposal:", error.message);
    return NextResponse.json(
      { error: "Failed to submit music proposal" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const proposals = await prisma.songProposal.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Latest proposals first
      },
    });
    return NextResponse.json(proposals);
  } catch (error: any) {
    console.error("Error fetching music proposals:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch music proposals" },
      { status: 500 }
    );
  }
}