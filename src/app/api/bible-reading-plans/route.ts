import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const bibleStudies = await prisma.bibleStudy.findMany();
    return NextResponse.json(bibleStudies);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching bible reading plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newBibleStudy = await prisma.bibleStudy.create({ data: body });
    return NextResponse.json(newBibleStudy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating bible reading plan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Bible Reading Plan ID is required' }, { status: 400 });
  }

  try {
    const updatedBibleStudy = await prisma.bibleStudy.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedBibleStudy);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating bible reading plan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Bible Reading Plan ID is required' }, { status: 400 });
  }

  try {
    await prisma.bibleStudy.delete({ where: { id } });
    return NextResponse.json({ message: 'Bible reading plan deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting bible reading plan' }, { status: 500 });
  }
}
