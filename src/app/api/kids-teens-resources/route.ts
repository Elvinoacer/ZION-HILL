import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const resources = await prisma.asset.findMany({ where: { tags: { has: 'kids-teens' } } });
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching kids and teens resources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newResource = await prisma.asset.create({ data: { ...body, tags: [...(body.tags || []), 'kids-teens'] } });
    return NextResponse.json(newResource, { status: 201 });
  } catch (error: any) {
    console.error("Error creating kids and teens resource:", error);
    return NextResponse.json({ error: 'Error creating kids and teens resource', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
  }

  try {
    const updatedResource = await prisma.asset.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), 'kids-teens'] },
    });
    return NextResponse.json(updatedResource);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating kids and teens resource' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting kids and teens resource' }, { status: 500 });
  }
}
