import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const funds = await prisma.fund.findMany();
    return NextResponse.json(funds);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching funds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newFund = await prisma.fund.create({ data: body });
    return NextResponse.json(newFund, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating fund' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Fund ID is required' }, { status: 400 });
  }

  try {
    const updatedFund = await prisma.fund.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedFund);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating fund' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Fund ID is required' }, { status: 400 });
  }

  try {
    await prisma.fund.delete({ where: { id } });
    return NextResponse.json({ message: 'Fund deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting fund' }, { status: 500 });
  }
}
