import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const partners = await prisma.partner.findMany();
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching partners' }, { status: 500 });
  }
}
