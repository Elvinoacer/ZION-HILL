import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const media = await prisma.asset.findMany();
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newMedia = await prisma.asset.create({ data: body });
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating media' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  try {
    const updatedMedia = await prisma.asset.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedMedia);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting media' }, { status: 500 });
  }
}
