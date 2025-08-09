import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const groups = await prisma.group.findMany();
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newGroup = await prisma.group.create({ data: body });
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating group' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
  }

  try {
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedGroup);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating group' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
  }

  try {
    await prisma.group.delete({ where: { id } });
    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting group' }, { status: 500 });
  }
}
