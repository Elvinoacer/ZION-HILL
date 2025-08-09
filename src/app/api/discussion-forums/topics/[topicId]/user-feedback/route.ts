import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topicId: string } }) {
  const { topicId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const feedback = await prisma.topicFeedback.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
      select: { type: true },
    });

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error(`Error fetching user feedback for topic ${topicId}:`, error);
    return NextResponse.json({ error: `Error fetching user feedback: ${error.message}` }, { status: 500 });
  }
}
