// src/app/api/send-notification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { messaging } from '@/lib/firebaseAdmin';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }

  try {
    const userTokens = await prisma.fcmToken.findMany();
    const guestTokens = await prisma.token.findMany();
    const allTokens = [...userTokens.map(t => t.token), ...guestTokens.map(t => t.token)];

    if (allTokens.length === 0) {
      return NextResponse.json({ message: 'No tokens registered' });
    }

    const message = {
      notification: { title, body },
      tokens: allTokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log('Successfully sent message:', response);
    return NextResponse.json({ message: 'Notifications sent', successCount: response.successCount });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
