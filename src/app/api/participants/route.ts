import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const participants = await prisma.participant.findMany();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching participants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newParticipant = await prisma.participant.create({ data: body });
    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating participant' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  try {
    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating participant' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  try {
    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting participant' }, { status: 500 });
  }
}
