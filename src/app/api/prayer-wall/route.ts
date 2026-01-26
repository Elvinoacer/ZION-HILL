import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotification } from "@/lib/notification-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';

  try {
    const prayerRequests = await prisma.prayerRequest.findMany({
      where: isAdmin ? {} : { isPublic: true },
      select: {
        id: true,
        request: true,
        isUrgent: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        status: true,
        dailyRoomUrl: true,
        dailyRoomName: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json(prayerRequests);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json({ error: 'Error fetching prayer requests', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newPrayerRequest = await prisma.prayerRequest.create({ data: { ...body, isPublic: true, status: body.status || 'PENDING' } });

    // Notify Prayer Team
    try {
      const prayerTeam = await prisma.user.findMany({
        where: {
          roles: {
            hasSome: ["PRAYER_MANAGER", "SENIOR_PASTOR"],
          },
        },
        select: { id: true },
      });

      const teamIds = prayerTeam.map((u) => u.id);

      if (teamIds.length > 0) {
        await sendNotification({
          userIds: teamIds,
          title: "New Prayer Request",
          body: `A new ${newPrayerRequest.isUrgent ? "URGENT " : ""}prayer request has been posted.`,
          data: {
            url: "/senior_pastor/prayer-requests", // or appropriate prayer management route
            requestId: newPrayerRequest.id,
          },
        });
      }
    } catch (notifyError) {
      console.error("Error sending prayer notification:", notifyError);
    }

    return NextResponse.json(newPrayerRequest, { status: 201 });
  } catch (error: any) {
    console.error("Error creating public prayer request:", error);
    return NextResponse.json({ error: 'Error creating public prayer request', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Prayer Request ID is required' }, { status: 400 });
  }

  try {
    const updatedPrayerRequest = await prisma.prayerRequest.update({
      where: { id },
      data: { ...body, isPublic: true },
    });
    return NextResponse.json(updatedPrayerRequest);
  } catch (error) {
    console.error("Error updating public prayer request:", error);
    return NextResponse.json({ error: 'Error updating public prayer request', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Prayer Request ID is required' }, { status: 400 });
  }

  try {
    await prisma.prayerRequest.delete({ where: { id } });
    return NextResponse.json({ message: 'Public prayer request deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting public prayer request' }, { status: 500 });
  }
}
