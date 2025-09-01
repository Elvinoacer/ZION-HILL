
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FeedbackType } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { topicId: string, postId: string } }) {
  try {
    const { userId, type } = await request.json();

    if (!userId || !type || !Object.values(FeedbackType).includes(type)) {
      return NextResponse.json({ error: 'userId and a valid type (LIKE/DISLIKE) are required' }, { status: 400 });
    }

    const existingFeedback = await prisma.postFeedback.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: params.postId,
        },
      },
    });

    if (existingFeedback) {
      if (existingFeedback.type === type) {
        await prisma.postFeedback.delete({
          where: {
            id: existingFeedback.id,
          },
        });
      } else {
        await prisma.postFeedback.update({
          where: {
            id: existingFeedback.id,
          },
          data: {
            type,
          },
        });
      }
    } else {
      await prisma.postFeedback.create({
        data: {
          userId,
          postId: params.postId,
          type,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Error processing feedback for post ${params.postId}:`, error);
    return NextResponse.json({ error: `Error processing feedback: ${error.message}` }, { status: 500 });
  }
}
