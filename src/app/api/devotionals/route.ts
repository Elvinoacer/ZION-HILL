import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const devotionals = await prisma.asset.findMany({ where: { type: 'RESOURCE', tags: { has: 'devotional' } } });
    return NextResponse.json(devotionals);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching devotionals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newDevotional = await prisma.asset.create({ data: { ...body, type: 'RESOURCE', tags: [...(body.tags || []), 'devotional'] } });
    return NextResponse.json(newDevotional, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating devotional' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Devotional ID is required' }, { status: 400 });
  }

  try {
    const updatedDevotional = await prisma.asset.update({
      where: { id },
      data: { ...body, type: 'RESOURCE', tags: [...(body.tags || []), 'devotional'] },
    });
    return NextResponse.json(updatedDevotional);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating devotional' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Devotional ID is required' }, { status: 400 });
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: 'Devotional deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting devotional' }, { status: 500 });
  }
}
