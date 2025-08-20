import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

// This is a simplified implementation. In a real-world scenario, 
// you would also integrate with email/SMS services.
export async function POST(req: Request) {
  try {
    // 1. Get all users in the prayer chain
    const prayerChainMembers = await prisma.user.findMany({
      where: {
        roles: {
          some: { name: 'Prayer Team' } // Or some other way to identify prayer chain members
        }
      }
    });

    if (prayerChainMembers.length === 0) {
      return new NextResponse('No members in the prayer chain', { status: 404 });
    }

    // 2. Trigger a notification for each member
    for (const member of prayerChainMembers) {
      await pusherServer.trigger(`user-${member.id}`, 'prayer-chain-activated', {
        message: 'An urgent prayer request has been initiated. Please check the prayer wall.',
      });
    }

    // 3. Log the activation
    await prisma.prayerChainActivation.create({
      data: {
        activatedBy: 'Senior Pastor', // In a real app, you would get the current user
      }
    });

    return new NextResponse('Prayer chain activated', { status: 200 });
  } catch (error) {
    console.error('[PRAYER_CHAIN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
