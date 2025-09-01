
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
        user: { select: { name: true, image: true } },
        _count: {
          select: { posts: true }, // Include count of posts for each topic
        },
        topicFeedbacks: {
            select: {
                type: true
            }
        }
      },
    });

    const topicsWithCounts = relatedTopics.map(topic => {
        const likes = topic.topicFeedbacks.filter(fb => fb.type === 'LIKE').length;
        const dislikes = topic.topicFeedbacks.filter(fb => fb.type === 'DISLIKE').length;
        // eslint-disable-next-line no-unused-vars
        const { topicFeedbacks, ...rest } = topic;
        return { ...rest, likes, dislikes };
    });

    return NextResponse.json(topicsWithCounts);
  } catch (error: any) {
    console.error("Error fetching related topics:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch related topics" },
      { status: 500 }
    );
  }
}
