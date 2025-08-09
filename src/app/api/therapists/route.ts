import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const therapists = await prisma.user.findMany({ where: { roles: { some: { name: 'STAFF' } } } });
    return NextResponse.json(therapists);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching therapists' }, { status: 500 });
  }
}
