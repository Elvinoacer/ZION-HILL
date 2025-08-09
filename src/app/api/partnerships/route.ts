import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const partners = await prisma.partner.findMany();
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching partnerships' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newPartner = await prisma.partner.create({ data: body });
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating partnership' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
  }

  try {
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedPartner);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating partnership' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
  }

  try {
    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ message: 'Partnership deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting partnership' }, { status: 500 });
  }
}
