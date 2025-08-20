import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Assuming this path

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const blogPost = await prisma.asset.findUnique({ where: { id, type: 'DOCUMENT', tags: { has: 'blog' } } });
      if (!blogPost) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(blogPost);
    }
    const blogPosts = await prisma.asset.findMany({ where: { type: 'DOCUMENT', tags: { has: 'blog' } } });
    return NextResponse.json(blogPosts);
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: 'Error fetching blog posts', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uploaderId = session.user.id;
  const body = await request.json();

  try {
    const newBlogPost = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT', tags: [...(body.tags || []), 'blog'], uploaderId } });
    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: 'Error creating blog post', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Blog Post ID is required' }, { status: 400 });
  }

  try {
    const updatedBlogPost = await prisma.asset.update({
      where: { id },
      data: { ...body, type: 'DOCUMENT', tags: [...(body.tags || []), 'blog'] },
    });
    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Blog Post ID is required' }, { status: 400 });
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 });
  }
}
