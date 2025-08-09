import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topicId: string } }) {
  const { topicId } = params;
  try {
    const posts = await prisma.forumPost.findMany({
      where: { topicId },
      include: {
        user: { select: { name: true, image: true } }, // Include user name and image
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error(`Error fetching posts for topic ${topicId}:`, error);
    return NextResponse.json({ error: `Error fetching posts: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  const { topicId } = params;
  try {
    const { content, userId, imageUrl, videoUrl } = await request.json();

    if (!content || !userId) {
      return NextResponse.json({ error: 'Content and userId are required' }, { status: 400 });
    }

    const newPost = await prisma.forumPost.create({
      data: {
        content,
        userId,
        topicId,
        imageUrl,
        videoUrl,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error(`Error creating post for topic ${topicId}:`, error);
    return NextResponse.json({ error: `Error creating post: ${error.message}` }, { status: 500 });
  }
}
