import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const plan = await prisma.bibleStudy.findUnique({
      where: { id: params.id },
      include: {
        lessons: true, // Include the lessons related to the plan
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to fetch bible study plan:", error);
    return NextResponse.json({ error: 'Error fetching bible reading plan' }, { status: 500 });
  }
}
