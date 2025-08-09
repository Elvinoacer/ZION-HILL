import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { familyId: string } }) {
  const { familyId } = params;
  const body = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: body.userId },
      data: { familyId: familyId },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error adding member to family:", error);
    return NextResponse.json({ error: 'Error adding member to family' }, { status: 500 });
  }
}
