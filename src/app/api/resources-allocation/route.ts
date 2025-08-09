import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const allocations = await prisma.resourceAllocation.findMany();
    return NextResponse.json(allocations);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching resource allocations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newAllocation = await prisma.resourceAllocation.create({ data: body });
    return NextResponse.json(newAllocation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating resource allocation' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Resource Allocation ID is required' }, { status: 400 });
  }

  try {
    const updatedAllocation = await prisma.resourceAllocation.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedAllocation);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating resource allocation' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Resource Allocation ID is required' }, { status: 400 });
  }

  try {
    await prisma.resourceAllocation.delete({ where: { id } });
    return NextResponse.json({ message: 'Resource allocation deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting resource allocation' }, { status: 500 });
  }
}
