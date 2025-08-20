import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, bibleStudyId } = body;

    if (!title || !content || !bibleStudyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        content,
        bibleStudyId,
      },
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return NextResponse.json({ error: 'Error creating lesson' }, { status: 500 });
  }
}
