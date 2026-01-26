import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@prisma/client';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');

  try {
    let participants;
    if (serviceId) {
      participants = await prisma.participant.findMany({
        where: { eventId: serviceId },
        include: { user: true }, // Include user details
      });
    } else {
      participants = await prisma.participant.findMany({
        include: { user: true }, // Include user details even if no serviceId
      });
    }
    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({ error: 'Error fetching participants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  try {
    const newParticipant = await prisma.participant.create({ data: body });
    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating participant' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  try {
    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating participant' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  try {
    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting participant' }, { status: 500 });
  }
}
