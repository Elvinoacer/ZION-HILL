import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const sponsors = await prisma.sponsor.findMany();
    return NextResponse.json(sponsors);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sponsors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newSponsor = await prisma.sponsor.create({ data: body });
    return NextResponse.json(newSponsor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating sponsor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 });
  }

  try {
    const updatedSponsor = await prisma.sponsor.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedSponsor);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating sponsor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 });
  }

  try {
    await prisma.sponsor.delete({ where: { id } });
    return NextResponse.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting sponsor' }, { status: 500 });
  }
}
