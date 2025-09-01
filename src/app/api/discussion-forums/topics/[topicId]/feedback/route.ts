import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FeedbackType } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  try {
    const { userId, type } = await request.json();

    if (!userId || !type || !Object.values(FeedbackType).includes(type)) {
      return NextResponse.json({ error: 'userId and a valid type (LIKE/DISLIKE) are required' }, { status: 400 });
    }

    const existingFeedback = await prisma.topicFeedback.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: params.topicId,
        },
      },
    });

    if (existingFeedback) {
      if (existingFeedback.type === type) {
        // If the user is submitting the same feedback type, remove it (toggle off)
        await prisma.topicFeedback.delete({
          where: {
            id: existingFeedback.id,
          },
        });
      } else {
        // If the user is changing their feedback type, update it
        await prisma.topicFeedback.update({
          where: {
            id: existingFeedback.id,
          },
          data: {
            type,
          },
        });
      }
    } else {
      // If no feedback exists, create it
      await prisma.topicFeedback.create({
        data: {
          userId,
          topicId: params.topicId,
          type,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Error processing feedback for topic ${params.topicId}:`, error);
    return NextResponse.json({ error: `Error processing feedback: ${error.message}` }, { status: 500 });
  }
}