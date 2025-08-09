import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const messages = await prisma.prayerRequest.findMany({ where: { tags: { has: 'ask-the-pastor' } } });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching Ask the Pastor messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newMessage = await prisma.prayerRequest.create({ data: { ...body, tags: [...(body.tags || []), 'ask-the-pastor'] } });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating Ask the Pastor message' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  try {
    const updatedMessage = await prisma.prayerRequest.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), 'ask-the-pastor'] },
    });
    return NextResponse.json(updatedMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating Ask the Pastor message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  try {
    await prisma.prayerRequest.delete({ where: { id } });
    return NextResponse.json({ message: 'Ask the Pastor message deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting Ask the Pastor message' }, { status: 500 });
  }
}
