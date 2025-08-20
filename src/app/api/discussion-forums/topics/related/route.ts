import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const excludeId = searchParams.get("excludeId");
  const limit = parseInt(searchParams.get("limit") || "3"); // Default to 3 related topics

  try {
    const relatedTopics = await prisma.forumTopic.findMany({
      where: {
        id: {
          not: excludeId || undefined, // Exclude the current topic if excludeId is provided
        },
      },
      orderBy: {
        createdAt: "desc", // Order by most recent
      },
      take: limit, // Take a limited number of topics
      include: {
        _count: {
          select: { posts: true }, // Include count of posts for each topic
        },
      },
    });

    return NextResponse.json(relatedTopics);
  } catch (error: any) {
    console.error("Error fetching related topics:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch related topics" },
      { status: 500 }
    );
  }
}