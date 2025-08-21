import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedPrayerRequest = await prisma.prayerRequest.update({
      where: { id: id },
      data: { status: status },
    });

    return NextResponse.json(updatedPrayerRequest);
  } catch (error) {
    console.error('Error updating prayer request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
