import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is available here

export async function GET() {
  try {
    const trends = await prisma.counselingSession.groupBy({
      by: ["topicId"],
      _count: {
        topicId: true,
      },
      where: {
        topicId: {
          not: null, // Only count sessions with a defined topic
        },
      },
      orderBy: {
        _count: {
          topicId: "desc",
        },
      },
    });

    // Fetch topic names for the topicIds
    const topicIds = trends.map((t) => t.topicId);
    const topics = await prisma.counselingTopic.findMany({
      where: {
        id: {
          in: topicIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topicMap = new Map(topics.map((topic) => [topic.id, topic.name]));

    // Map the results to the format expected by the frontend
    const formattedTrends = trends.map((t, index) => ({
      id: index + 1, // Simple ID for frontend, can be improved if needed
      need: topicMap.get(t.topicId!) || "Unknown",
      count: t._count.topicId,
    }));

    return NextResponse.json(formattedTrends);
  } catch (error) {
    console.error("Error fetching counseling trends:", error);
    return NextResponse.json(
      { message: "Error fetching trends" },
      { status: 500 }
    );
  }
}
