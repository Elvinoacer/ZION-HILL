
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topicId: string } }) {
  try {
    const topic = await prisma.forumTopic.findUnique({
      where: { id: params.topicId },
      include: {
        user: { select: { name: true, image: true } },
        posts: {
          include: {
            user: { select: { name: true, image: true } },
            feedback: true, // Include feedback for each post
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        topicFeedbacks: true, // Include feedback for the topic
      },
    });

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    const likes = topic.topicFeedbacks.filter(fb => fb.type === 'LIKE').length;
    const dislikes = topic.topicFeedbacks.filter(fb => fb.type === 'DISLIKE').length;

    const postsWithCounts = topic.posts.map(post => {
        const postLikes = post.feedback.filter(fb => fb.type === 'LIKE').length;
        const postDislikes = post.feedback.filter(fb => fb.type === 'DISLIKE').length;
        return { ...post, likes: postLikes, dislikes: postDislikes };
    });

    // eslint-disable-next-line no-unused-vars
    const { topicFeedbacks, ...rest } = topic;

    return NextResponse.json({ ...rest, likes, dislikes, posts: postsWithCounts });
  } catch (error: any) {
    console.error(`Error fetching topic ${params.topicId}:`, error);
    return NextResponse.json({ error: `Error fetching topic: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { topicId: string } }) {
  try {
    await prisma.forumTopic.delete({
      where: { id: params.topicId },
    });

    return NextResponse.json({ message: 'Topic deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting topic ${params.topicId}:`, error);
    return NextResponse.json({ error: `Error deleting topic: ${error.message}` }, { status: 500 });
  }
}
