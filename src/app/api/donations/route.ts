
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const donations = await prisma.transaction.findMany({
      where: {
        type: 'DONATION',
        reconciliationStatus: 'APPROVED',
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
