import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@prisma/client';

async function isOutreachPrivileged(session: any) {
  if (!session?.user?.roles) return false;
  const roles = session.user.roles;
  return roles.includes(RoleName.ADMIN) || 
         roles.includes(RoleName.SENIOR_PASTOR) || 
         roles.includes(RoleName.OUTREACH_PASTOR);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const outreachPrograms = await prisma.event.findMany({ where: { type: 'EVENT' } });
    return NextResponse.json(outreachPrograms);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching outreach programs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isOutreachPrivileged(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  try {
    const newOutreachProgram = await prisma.event.create({ data: { ...body, type: 'EVENT' } });
    return NextResponse.json(newOutreachProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating outreach program' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isOutreachPrivileged(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const updatedOutreachProgram = await prisma.event.update({
      where: { id },
      data: { ...body, type: 'EVENT' },
    });
    return NextResponse.json(updatedOutreachProgram);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating outreach program' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isOutreachPrivileged(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Outreach program deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting outreach program' }, { status: 500 });
  }
}