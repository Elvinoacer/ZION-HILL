import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
