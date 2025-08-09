import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching feedback' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newFeedback = await prisma.feedback.create({ data: body });
    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating feedback' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
  }

  try {
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedFeedback);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating feedback' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
  }

  try {
    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting feedback' }, { status: 500 });
  }
}
