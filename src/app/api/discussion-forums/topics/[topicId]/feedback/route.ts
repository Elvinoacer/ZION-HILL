import { FeedbackType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  const { topicId } = await params;
  const { userId, type } = await request.json(); // type will be 'LIKE' or 'DISLIKE'

  console.log(
    `Received POST feedback for topic ${topicId}: userId=${userId}, type=${type}`
  );

  if (!userId || !type) {
    console.error("Missing userId or type in POST request");
    return NextResponse.json(
      { error: "userId and type are required" },
      { status: 400 }
    );
  }

  try {
    const existingFeedback = await prisma.topicFeedback.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    console.log("Existing topic feedback:", existingFeedback);
    console.log(
      "Comparing types:",
      type,
      FeedbackType.LIKE,
      FeedbackType.DISLIKE
    );

    let updatedTopic;

    if (existingFeedback) {
      // User is changing their feedback or removing it
      if (existingFeedback.type === type) {
        // User is removing their existing feedback
        console.log("Removing existing topic feedback");
        await prisma.topicFeedback.delete({
          where: {
            id: existingFeedback.id,
          },
        });
        updatedTopic = await prisma.forumTopic.update({
          where: { id: topicId },
          data: {
            likes: type === FeedbackType.LIKE ? { decrement: 1 } : undefined,
            dislikes:
              type === FeedbackType.DISLIKE ? { decrement: 1 } : undefined,
          },
        });
      } else {
        // User is changing feedback (e.g., from LIKE to DISLIKE)
        console.log("Changing topic feedback");
        await prisma.topicFeedback.update({
          where: {
            id: existingFeedback.id,
          },
          data: {
            type,
          },
        });
        updatedTopic = await prisma.forumTopic.update({
          where: { id: topicId },
          data: {
            likes:
              type === FeedbackType.LIKE ? { increment: 1 } : { decrement: 1 },
            dislikes:
              type === FeedbackType.DISLIKE
                ? { increment: 1 }
                : { decrement: 1 },
          },
        });
      }
    } else {
      // User is adding new feedback
      console.log("Adding new topic feedback");
      await prisma.topicFeedback.create({
        data: {
          userId,
          topicId,
          type,
        },
      });
      updatedTopic = await prisma.forumTopic.update({
        where: { id: topicId },
        data: {
          likes: type === FeedbackType.LIKE ? { increment: 1 } : undefined,
          dislikes:
            type === FeedbackType.DISLIKE ? { increment: 1 } : undefined,
        },
      });
    }

    return NextResponse.json(updatedTopic);
  } catch (error: any) {
    console.error(
      `Error processing topic feedback for topic ${topicId}:`,
      error
    );
    return NextResponse.json(
      { error: `Error processing feedback: ${error.message}` },
      { status: 500 }
    );
  }
}
