import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const tickets = await prisma.ticket.findMany();
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newTicket = await prisma.ticket.create({ data: body });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating ticket' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedTicket);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating ticket' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting ticket' }, { status: 500 });
  }
}
