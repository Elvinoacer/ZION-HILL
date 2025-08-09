import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const auditLogs = await prisma.auditLog.findMany();
    return NextResponse.json(auditLogs);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching audit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newAuditLog = await prisma.auditLog.create({ data: body });
    return NextResponse.json(newAuditLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating audit log' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Audit Log ID is required' }, { status: 400 });
  }

  try {
    const updatedAuditLog = await prisma.auditLog.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedAuditLog);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating audit log' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Audit Log ID is required' }, { status: 400 });
  }

  try {
    await prisma.auditLog.delete({ where: { id } });
    return NextResponse.json({ message: 'Audit log deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting audit log' }, { status: 500 });
  }
}
