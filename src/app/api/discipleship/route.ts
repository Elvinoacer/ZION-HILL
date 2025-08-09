import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'meetings':
        const meetings = await prisma.event.findMany({ where: { type: 'MEETING' } });
        return NextResponse.json(meetings);
      case 'members':
        const members = await prisma.user.findMany({ where: { roles: { some: { name: 'MEMBER' } } } });
        return NextResponse.json(members);
      case 'resources':
        const resources = await prisma.asset.findMany({ where: { type: 'RESOURCE' } });
        return NextResponse.json(resources);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newDiscipleshipEvent = await prisma.event.create({ data: { ...body, type: 'MEETING' } });
    return NextResponse.json(newDiscipleshipEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating discipleship event' }, { status: 500 });
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
    const updatedDiscipleshipEvent = await prisma.event.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedDiscipleshipEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating discipleship event' }, { status: 500 });
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
    return NextResponse.json({ message: 'Discipleship event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting discipleship event' }, { status: 500 });
  }
}