import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const parentalControls = await prisma.parentalControl.findUnique({
      where: { userId: userId },
    });

    if (!parentalControls) {
      // If no controls exist for the user, return default settings
      return NextResponse.json({
        contentFilter: false,
        activityMonitoring: false,
        screenTimeLimit: false,
        screenTimeHours: 0,
        messagingRestrictions: false,
      });
    }

    return NextResponse.json(parentalControls);
  } catch (error) {
    console.error("Error fetching parental controls:", error);
    return NextResponse.json({ error: 'Error fetching parental controls' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { userId, ...data } = body;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const updatedControls = await prisma.parentalControl.upsert({
      where: { userId: userId },
      update: data,
      create: { userId, ...data },
    });
    return NextResponse.json(updatedControls);
  } catch (error) {
    console.error("Error updating parental controls:", error);
    return NextResponse.json({ error: 'Error updating parental controls' }, { status: 500 });
  }
}
