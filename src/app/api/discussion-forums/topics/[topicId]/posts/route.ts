import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topicId: string } }) {
  try {
    const posts = await prisma.forumPost.findMany({
      where: { topicId: params.topicId },
      include: {
        user: { select: { name: true, image: true } },
        feedback: true, // Include feedback for each post
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const postsWithCounts = posts.map(post => {
        const likes = post.feedback.filter(fb => fb.type === 'LIKE').length;
        const dislikes = post.feedback.filter(fb => fb.type === 'DISLIKE').length;
        // eslint-disable-next-line no-unused-vars
        const { feedback, ...rest } = post;
        return { ...rest, likes, dislikes, feedback };
    });

    return NextResponse.json(postsWithCounts);
  } catch (error: any) {
    console.error(`Error fetching posts for topic ${params.topicId}:`, error);
    return NextResponse.json({ error: `Error fetching posts: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  try {
    const { content, userId, imageUrl, videoUrl } = await request.json();

    if (!content || !userId) {
      return NextResponse.json({ error: 'Content and userId are required' }, { status: 400 });
    }

    const newPost = await prisma.forumPost.create({
      data: {
        content,
        userId,
        topicId: params.topicId,
        imageUrl,
        videoUrl,
      },
      include: {
        user: { select: { name: true, image: true } },
        feedback: true,
      },
    });
    
    const postWithCounts = {
        ...newPost,
        likes: 0,
        dislikes: 0
    }

    return NextResponse.json(postWithCounts, { status: 201 });
  } catch (error: any) {
    console.error(`Error creating post for topic ${params.topicId}:`, error);
    return NextResponse.json({ error: `Error creating post: ${error.message}` }, { status: 500 });
  }
}