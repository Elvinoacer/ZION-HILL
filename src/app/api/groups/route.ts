import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, description, ministryId, leaderId } = await request.json();

    if (!name || !ministryId || !leaderId) {
      return NextResponse.json({ error: 'Name, ministryId, and leaderId are required' }, { status: 400 });
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        ministry: {
          connect: { id: ministryId },
        },
        leader: {
          connect: { id: leaderId },
        },
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}