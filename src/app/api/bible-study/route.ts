
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bibleStudy = await prisma.bibleStudy.findFirst({
      // Add any necessary filtering or ordering logic here
    });
    return NextResponse.json(bibleStudy);
  } catch (error) {
    console.error('Error fetching bible study:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
