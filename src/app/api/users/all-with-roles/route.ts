import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@/generated/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.roles?.includes(RoleName.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true, // Select the roles array directly
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching all users with roles:", error);
    return NextResponse.json({ error: 'Error fetching all users with roles' }, { status: 500 });
  }
}
