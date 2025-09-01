
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bibleStudyCourses = await prisma.bibleStudyCourse.findMany({
      // Later, we can add logic to fetch specific courses, e.g., for a user
    });
    return NextResponse.json(bibleStudyCourses);
  } catch (error) {
    console.error('Error fetching bible study:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
