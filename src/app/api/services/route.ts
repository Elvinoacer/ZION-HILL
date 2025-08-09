import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type) {
      const services = await prisma.event.findMany({ where: { type: type.toUpperCase() as EventType } });
      return NextResponse.json(services);
    } else {
      const services = await prisma.event.findMany({ where: { type: 'SERVICE' } });
      return NextResponse.json(services);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, ...data } = body;
    try {
        const newService = await prisma.event.create({ data: { ...data, type: type.toUpperCase() as EventType } });
        return NextResponse.json(newService);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { type, ...data } = body;

    if (!id) {
        return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    try {
        const updatedService = await prisma.event.update({
            where: { id },
            data: { ...data, type: type ? type.toUpperCase() as EventType : undefined },
        });
        return NextResponse.json(updatedService);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    try {
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting data' }, { status: 500 });
    }
}