import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    // Trigger a Pusher event to broadcast the announcement
    await pusherServer.trigger('announcements', 'new-announcement', { message });

    return new NextResponse('Announcement broadcasted', { status: 200 });
  } catch (error) {
    console.error('[BROADCAST_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
