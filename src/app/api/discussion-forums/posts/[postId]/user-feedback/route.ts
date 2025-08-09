import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const feedback = await prisma.postFeedback.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: { type: true },
    });

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error(`Error fetching user feedback for post ${postId}:`, error);
    return NextResponse.json({ error: `Error fetching user feedback: ${error.message}` }, { status: 500 });
  }
}
