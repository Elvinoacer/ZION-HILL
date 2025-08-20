import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use the shared Prisma instance

export async function DELETE(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const { topicId } = params;
    console.log("Attempting to delete discussion forum topic with ID:", topicId);

    if (!topicId) {
      console.error("Topic ID is missing!");
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    // Delete the topic. Assuming onDelete: Cascade is configured in Prisma schema
    // for related models (ForumPost, ForumTopicLike, ForumTopicDislike)
    await prisma.forumTopic.delete({
      where: {
        id: topicId,
      },
    });

    console.log("Discussion forum topic deleted successfully:", topicId);
    return NextResponse.json({ message: "Discussion forum topic deleted successfully" }, { status: 200 });
  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error deleting discussion forum topic in API route:", errorMessage);
    return NextResponse.json({ error: "Failed to delete discussion forum topic" }, { status: 500 });
  }
}