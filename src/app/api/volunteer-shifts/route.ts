import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');

  try {
    if (id) {
      const shift = await prisma.volunteerShift.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, title: true, date: true } },
        },
      });
      if (!shift) {
        return NextResponse.json({ error: 'Volunteer shift not found' }, { status: 404 });
      }
      return NextResponse.json(shift);
    } else {
      const whereClause: any = {};
      if (eventId) whereClause.eventId = eventId;
      if (userId) whereClause.userId = userId;

      const shifts = await prisma.volunteerShift.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, title: true, date: true } },
        },
      });
      return NextResponse.json(shifts);
    }
  } catch (error) {
    console.error('Error fetching volunteer shifts:', error);
    return NextResponse.json({ error: 'Error fetching volunteer shifts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newShift = await prisma.volunteerShift.create({ data: body });
    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error('Error creating volunteer shift:', error);
    return NextResponse.json({ error: 'Error creating volunteer shift' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Volunteer shift ID is required' }, { status: 400 });
  }

  try {
    const updatedShift = await prisma.volunteerShift.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedShift);
  } catch (error) {
    console.error('Error updating volunteer shift:', error);
    return NextResponse.json({ error: 'Error updating volunteer shift' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Volunteer shift ID is required' }, { status: 400 });
  }

  try {
    await prisma.volunteerShift.delete({ where: { id } });
    return NextResponse.json({ message: 'Volunteer shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer shift:', error);
    return NextResponse.json({ error: 'Error deleting volunteer shift' }, { status: 500 });
  }
}
