import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topSongs = await prisma.songProposal.findMany({
      orderBy: {
        likes: "desc",
      },
      take: 5, // Get top 5 songs
      select: {
        title: true,
        likes: true,
      },
    });

    const formattedTopSongs = topSongs.map((song) => ({
      name: song.title,
      times: song.likes,
    }));

    return NextResponse.json(formattedTopSongs);
  } catch (error: any) {
    console.error("Error fetching top songs data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch top songs data" },
      { status: 500 }
    );
  }
}