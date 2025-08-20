import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const testimonies = await prisma.feedback.findMany({
      where: { tags: { has: 'testimony' } },
      include: {
        user: {
          select: { name: true },
        },
      },
    });
    return NextResponse.json(testimonies);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching testimonies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newTestimony = await prisma.feedback.create({ data: { ...body, tags: [...(body.tags || []), 'testimony'] } });
    return NextResponse.json(newTestimony, { status: 201 });
  } catch (error) {
    console.error("Error creating testimony:", error); // Added logging
    return NextResponse.json({ error: 'Error creating testimony' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Testimony ID is required' }, { status: 400 });
  }

  try {
    const updatedTestimony = await prisma.feedback.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), 'testimony'] },
    });
    return NextResponse.json(updatedTestimony);
  } catch (error) {
    console.error("Error updating testimony:", error); // Added logging
    return NextResponse.json({ error: 'Error updating testimony' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Testimony ID is required' }, { status: 400 });
  }

  try {
    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ message: 'Testimony deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting testimony' }, { status: 500 });
  }
}
