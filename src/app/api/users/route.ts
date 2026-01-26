import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { RoleName } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.SENIOR_PASTOR);

  try {
    // Correctly using boolean flags for conditional fields in Prisma select
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        email: isAdmin,
        roles: isAdmin,
        isActive: isAdmin,
        profileComplete: isAdmin,
        createdAt: isAdmin,
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const body = await request.json();
  const { familyId } = body;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.SENIOR_PASTOR);

  if (!isAdmin && (type === "connect" || type === "remove")) {
      if (id !== session.user.id) {
          if (familyId) {
             const family = await prisma.family.findUnique({
                 where: { id: familyId },
                 select: { createdById: true }
             });
             if (!family || family.createdById !== session.user.id) {
                 return NextResponse.json({ error: 'Forbidden: You do not have permission to manage this family' }, { status: 403 });
             }
          } else {
             return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
          }
      }
  } else if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Administrative access required' }, { status: 403 });
  }

  try {
    let updatedUser;
    if (type === "connect") {
      updatedUser = await prisma.user.update({
        where: { id },
        data: { familyId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          isActive: true,
          profileComplete: true,
          createdAt: true,
          familyId: true
        }
      });
    } else if (type === "remove") {
      updatedUser = await prisma.user.update({
        where: { id },
        data: { familyId: null },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          isActive: true,
          profileComplete: true,
          createdAt: true,
          familyId: true
        }
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
