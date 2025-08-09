import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching roles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newRole = await prisma.role.create({ data: body });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating role' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  try {
    const updatedRole = await prisma.role.update({
      where: { id: parseInt(id) },
      data: { ...body },
    });
    return NextResponse.json(updatedRole);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating role' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  try {
    await prisma.role.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting role' }, { status: 500 });
  }
}