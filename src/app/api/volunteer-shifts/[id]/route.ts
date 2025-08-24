import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { time, eventId, checkedIn, conflictCheck, replacementPool } = body;

    const updatedShift = await prisma.volunteerShift.update({
      where: { id },
      data: {
        time,
        eventId,
        checkedIn,
        conflictCheck,
        replacementPool,
      },
    });

    return NextResponse.json(updatedShift);
  } catch (error) {
    console.error('Error updating volunteer shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.volunteerShift.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Shift deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting volunteer shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}