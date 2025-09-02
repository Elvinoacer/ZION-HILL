import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        givingId: id,
        type: 'DONATION',
        reconciliationStatus: 'APPROVED',
      },
    });

    return NextResponse.json({ progress: result._sum.amount || 0 });
  } catch (error) {
    console.error('Error fetching giving progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
