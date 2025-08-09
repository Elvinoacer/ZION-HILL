import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FeedbackType } from "@/generated/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params;
  const { userId, type } = await request.json(); // type will be 'LIKE' or 'DISLIKE'

  console.log(
    `Received POST feedback for post ${postId}: userId=${userId}, type=${type}`
  );

  if (!userId || !type) {
    console.error("Missing userId or type in POST request");
    return NextResponse.json(
      { error: "userId and type are required" },
      { status: 400 }
    );
  }

  try {
    const existingFeedback = await prisma.postFeedback.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    console.log("Existing post feedback:", existingFeedback);
    console.log(
      "Comparing types:",
      type,
      FeedbackType.LIKE,
      FeedbackType.DISLIKE
    );

    let updatedPost;

    if (existingFeedback) {
      // User is changing their feedback or removing it
      if (existingFeedback.type === type) {
        // User is removing their existing feedback
        console.log("Removing existing post feedback");
        await prisma.postFeedback.delete({
          where: {
            id: existingFeedback.id,
          },
        });
        updatedPost = await prisma.forumPost.update({
          where: { id: postId },
          data: {
            likes: type === 'LIKE' ? { decrement: 1 } : undefined,
            dislikes: type === 'DISLIKE' ? { decrement: 1 } : undefined,
          },
        });
      } else {
        // User is changing feedback (e.g., from LIKE to DISLIKE)
        console.log('Changing post feedback');
        await prisma.postFeedback.update({
          where: {
            id: existingFeedback.id,
          },
          data: {
            type: type as FeedbackType,
          },
        });
        updatedPost = await prisma.forumPost.update({
          where: { id: postId },
          data: {
            likes: type === 'LIKE' ? { increment: 1 } : { decrement: 1 },
            dislikes: type === 'DISLIKE' ? { increment: 1 } : { decrement: 1 },
          },
        });
      }
    } else {
      // User is adding new feedback
      console.log('Adding new post feedback');
      await prisma.postFeedback.create({
        data: {
          userId,
          postId,
          type: type as FeedbackType,
        },
      });
      updatedPost = await prisma.forumPost.update({
        where: { id: postId },
        data: {
          likes: type === 'LIKE' ? { increment: 1 } : undefined,
          dislikes: type === 'DISLIKE' ? { increment: 1 } : undefined,
        },
      });
    }

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error(`Error processing post feedback for post ${postId}:`, error);
    return NextResponse.json(
      { error: `Error processing feedback: ${error.message}` },
      { status: 500 }
    );
  }
}
