import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@/generated/prisma';

export async function POST(request: Request, { params }: { params: { familyId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { familyId } = params;
  const body = await request.json();

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      select: { createdById: true },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Security: Only the family creator or an Admin can add members
    if (family.createdById !== session.user.id && !session.user.roles?.includes(RoleName.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
