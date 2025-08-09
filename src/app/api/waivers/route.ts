import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const waivers = await prisma.waiver.findMany();
    return NextResponse.json(waivers);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching waivers' }, { status: 500 });
  }
}
