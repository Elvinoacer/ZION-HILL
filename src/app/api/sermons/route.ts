import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        speaker: true,
      },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}