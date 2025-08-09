import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const familyEvents = await prisma.event.findMany({ where: { tags: { has: 'family-life' } } });
    return NextResponse.json(familyEvents);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching family life events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newFamilyEvent = await prisma.event.create({ data: { ...body, tags: [...(body.tags || []), 'family-life'] } });
    return NextResponse.json(newFamilyEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating family life event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Family Life Event ID is required' }, { status: 400 });
  }

  try {
    const updatedFamilyEvent = await prisma.event.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), 'family-life'] },
    });
    return NextResponse.json(updatedFamilyEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating family life event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Family Life Event ID is required' }, { status: 400 });
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Family life event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting family life event' }, { status: 500 });
  }
}
