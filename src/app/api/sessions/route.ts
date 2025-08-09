import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const sessions = await prisma.session.findMany();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sessions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newSession = await prisma.session.create({ data: body });
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating session' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const updatedSession = await prisma.session.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedSession);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating session' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting session' }, { status: 500 });
  }
}
