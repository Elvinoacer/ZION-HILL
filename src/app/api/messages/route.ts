import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get('recipientId');
  const readStatus = searchParams.get('read'); // 'true' or 'false'

  if (!recipientId) {
    return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
  }

  try {
    const whereClause: any = { recipientId };
    if (readStatus !== null) {
      whereClause.read = readStatus === 'true';
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { read } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  try {
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { read },
    });
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  try {
    await prisma.message.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}