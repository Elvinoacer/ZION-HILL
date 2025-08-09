import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prayerRequests = await prisma.prayerRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(prayerRequests);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { request: prayerRequestText, isUrgent, isPublic, userId } = await request.json();

    if (!prayerRequestText) {
      return NextResponse.json({ error: 'Prayer request text is required' }, { status: 400 });
    }

    const newPrayerRequest = await prisma.prayerRequest.create({
      data: {
        request: prayerRequestText,
        isUrgent: isUrgent || false,
        isPublic: isPublic || false,
        userId: userId || null, // userId can be null if not logged in
      },
    });

    return NextResponse.json(newPrayerRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating prayer request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}