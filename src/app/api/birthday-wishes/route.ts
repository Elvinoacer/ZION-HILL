import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { message, recipientId } = await request.json();

    if (!message || !recipientId) {
      return new NextResponse('Missing message or recipientId', { status: 400 });
    }

    const wish = await prisma.birthdayWish.create({
      data: {
        message,
        recipientId,
        senderId: session.user.id,
      },
    });

    return NextResponse.json(wish);
  } catch (error) {
    console.error('Error creating birthday wish:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('Missing userId', { status: 400 });
    }

    const wishes = await prisma.birthdayWish.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(wishes);
  } catch (error) {
    console.error('Error fetching birthday wishes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
