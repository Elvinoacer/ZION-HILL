import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, eventId, time } = body;

    if (!userId || !eventId || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newShift = await prisma.volunteerShift.create({
      data: {
        userId,
        eventId,
        time,
      },
    });

    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error('Error creating volunteer shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const shifts = await prisma.volunteerShift.findMany({
      where: { userId },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching volunteer shifts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}