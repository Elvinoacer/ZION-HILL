import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topics = await prisma.forumTopic.findMany({
      include: {
        user: { select: { name: true, image: true } }, // Include user name and image
        _count: { select: { posts: true } }, // Count of posts for each topic
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(topics);
  } catch (error: any) {
    console.error('Error fetching forum topics:', error);
    return NextResponse.json({ error: `Error fetching forum topics: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, userId, imageUrl, videoUrl } = await request.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: 'Title, content, and userId are required' }, { status: 400 });
    }

    const newTopic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        userId,
        imageUrl,
        videoUrl,
      },
    });

    return NextResponse.json(newTopic, { status: 201 });
  } catch (error: any) {
    console.error('Error creating forum topic:', error);
    return NextResponse.json({ error: `Error creating forum topic: ${error.message}` }, { status: 500 });
  }
}
