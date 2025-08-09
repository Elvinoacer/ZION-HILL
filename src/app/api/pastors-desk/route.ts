import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const pastorsDesk = await prisma.asset.findMany({ where: { type: 'DOCUMENT', tags: { has: 'pastors-desk' } } });
    return NextResponse.json(pastorsDesk);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching pastor's desk content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newPastorsDesk = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT', tags: [...(body.tags || []), 'pastors-desk'] } });
    return NextResponse.json(newPastorsDesk, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating pastor's desk content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Pastor's Desk ID is required' }, { status: 400 });
  }

  try {
    const updatedPastorsDesk = await prisma.asset.update({
      where: { id },
      data: { ...body, type: 'DOCUMENT', tags: [...(body.tags || []), 'pastors-desk'] },
    });
    return NextResponse.json(updatedPastorsDesk);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating pastor's desk content' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Pastor's Desk ID is required' }, { status: 400 });
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: 'Pastor's desk content deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting pastor's desk content' }, { status: 500 });
  }
}
