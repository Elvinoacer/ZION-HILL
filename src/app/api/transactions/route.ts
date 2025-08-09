import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const transactions = await prisma.transaction.findMany();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newTransaction = await prisma.transaction.create({ data: body });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
  }

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
  }

  try {
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
  }
}
