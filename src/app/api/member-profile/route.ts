import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@prisma/client';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
      userId = session.user.id;
  }

  // Privacy: Only the user themselves or an Admin can view the detailed profile
  if (userId !== session.user.id && !session.user.roles?.includes(RoleName.ADMIN)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        membersince: true,
        birthdate: true,
        photo: true,
        baptismApplicationStatus: true,
        baptismDate: true,
        transactions: {
          where: { reconciliationStatus: "APPROVED" },
          select: {
            id: true,
            date: true,
            amount: true,
            description: true,
          },
        },
        shifts: {
          select: {
            id: true,
            time: true,
            eventId: true,
            checkedIn: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    userId = session.user.id;
  }

  // Security: Only the user themselves or an Admin can update the profile
  if (userId !== session.user.id && !session.user.roles?.includes(RoleName.ADMIN)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, address, membersince, birthdate, photo } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        address,
        membersince,
        birthdate,
        photo,
      },
      select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          membersince: true,
          birthdate: true,
          photo: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}