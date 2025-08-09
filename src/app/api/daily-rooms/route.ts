import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { prayerRequestId } = body;

  try {
    const roomName = `prayer-room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    if (prayerRequestId) {
      await prisma.prayerRequest.update({
        where: { id: prayerRequestId },
        data: {
          dailyRoomUrl: jitsiUrl,
          dailyRoomName: roomName,
        },
      });
    }

    return NextResponse.json({ url: jitsiUrl, name: roomName });
  } catch (error: any) {
    console.error("Error creating Jitsi room URL or updating PrayerRequest:", error);
    return NextResponse.json({ error: 'Failed to create Jitsi room URL or update PrayerRequest', details: error.message }, { status: 500 });
  }
}
