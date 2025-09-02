import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RoleName } from '@/generated/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const givingOpportunity = await prisma.giving.findUnique({
      where: { id: params.id },
    });
    if (!givingOpportunity) {
      return NextResponse.json({ error: 'Giving opportunity not found' }, { status: 404 });
    }
    return NextResponse.json(givingOpportunity);
  } catch (error) {
    console.error('Error fetching giving opportunity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes(RoleName.FINANCE_ADMINISTRATOR)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, goalAmount, startDate, endDate } = body;

    const updatedGivingOpportunity = await prisma.giving.update({
      where: { id: params.id },
      data: {
        name,
        description,
        goalAmount,
        startDate,
        endDate,
      },
    });

    return NextResponse.json(updatedGivingOpportunity);
  } catch (error) {
    console.error('Error updating giving opportunity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.roles.includes(RoleName.FINANCE_ADMINISTRATOR)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.giving.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting giving opportunity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
