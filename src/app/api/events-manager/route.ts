import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const events = await prisma.event.findMany(); // Assuming events-manager primarily deals with events
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const body = await request.json();

  try {
    switch (type) {
      case 'invite-group':
        // In a real app, you'd invite a group
        return NextResponse.json({ message: 'Group invited' });
      case 'send-thank-you':
        // In a real app, you'd send a thank you
        return NextResponse.json({ message: 'Thank you sent' });
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}