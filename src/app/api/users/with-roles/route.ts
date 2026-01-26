import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RoleName } from '@/generated/prisma';

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

    // Filter out users who are only 'MEMBER' or 'GUEST'
    const privilegedUsers = users.filter(user => {
      // If a user has no roles, they are not privileged
      if (!user.roles || user.roles.length === 0) {
        return false;
      }
      // Check if all roles are 'MEMBER' or 'GUEST'
      return !user.roles.every(role => role === RoleName.MEMBER || role === RoleName.GUEST);
    });

    return NextResponse.json(privilegedUsers);
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return NextResponse.json({ error: 'Error fetching users with roles' }, { status: 500 });
  }
}
