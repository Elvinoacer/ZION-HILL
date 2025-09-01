// src/app/api/register-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { token, userId } = await req.json();

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    if (typeof userId === 'string' && userId.length > 0) {
      await prisma.fcmToken.upsert({
        where: { token },
        update: { userId },
        create: { token, userId },
      });
    } else {
      await prisma.token.upsert({
        where: { token },
        update: {},
        create: { token },
      });
    }
    return NextResponse.json({ message: 'Token registered' });
  } catch (error) {
    console.error('Error saving token:', error);
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 });
  }
}
