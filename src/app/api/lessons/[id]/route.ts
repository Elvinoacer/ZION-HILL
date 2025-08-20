import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single lesson (optional, but good practice)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching lesson' }, { status: 500 });
  }
}

// UPDATE a lesson
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating lesson' }, { status: 500 });
  }
}

// DELETE a lesson
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting lesson' }, { status: 500 });
  }
}
