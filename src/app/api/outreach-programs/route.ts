import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const outreachPrograms = await prisma.event.findMany({ where: { type: 'EVENT' } });
    return NextResponse.json(outreachPrograms);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching outreach programs' }, { status: 500 });
  }
}
