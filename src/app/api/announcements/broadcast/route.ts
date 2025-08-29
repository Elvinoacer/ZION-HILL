import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    // Trigger a Pusher event to broadcast the announcement
    await pusherServer.trigger('announcements', 'new-announcement', { message });

    // Get all users to email them
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: null,
        },
      },
    });

    const emailPromises = users.map(user => {
      return sendMail({
        to: user.email!,
        subject: 'Church Announcement',
        html: `<p>${message}</p>`,
      });
    });

    await Promise.all(emailPromises);

    return new NextResponse('Announcement broadcasted', { status: 200 });
  } catch (error) {
    console.error('[BROADCAST_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
