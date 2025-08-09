import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const volunteers = await prisma.user.findMany({ where: { roles: { some: { name: 'VOLUNTEER' } } } });
    return NextResponse.json(volunteers);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching volunteers' }, { status: 500 });
  }
}
