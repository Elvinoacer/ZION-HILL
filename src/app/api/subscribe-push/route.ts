import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();

    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 });
    }

    // Check if a subscription already exists for this user and endpoint
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: {
        endpoint: subscription.endpoint,
      },
    });

    if (existingSubscription) {
      // Optionally update if details change, or just return success if identical
      // For simplicity, we'll just return success if it already exists
      return NextResponse.json({ message: 'Subscription already exists' }, { status: 200 });
    }

    const newSubscription = await prisma.pushSubscription.create({
      data: {
        userId: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({ message: 'Subscription saved', data: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
