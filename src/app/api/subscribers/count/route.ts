import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.newsletterSubscriber.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return NextResponse.json({ error: 'Error fetching subscriber count' }, { status: 500 });
  }
}
