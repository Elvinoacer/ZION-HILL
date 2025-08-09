import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const blogPosts = await prisma.asset.findMany({ where: { type: 'DOCUMENT', tags: { has: 'blog' } } });
    return NextResponse.json(blogPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newBlogPost = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT', tags: [...(body.tags || []), 'blog'] } });
    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating blog post' }, { status: 500 });
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
