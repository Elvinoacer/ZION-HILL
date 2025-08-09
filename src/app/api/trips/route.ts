import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const trips = await prisma.event.findMany({ where: { type: 'TRIP' } });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching trips' }, { status: 500 });
  }
}
