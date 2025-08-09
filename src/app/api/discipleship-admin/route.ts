import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'lessons':
        const lessons = await prisma.lesson.findMany();
        return NextResponse.json(lessons);
      case 'member-progress':
        const memberProgress = await prisma.bibleStudyProgress.findMany();
        return NextResponse.json(memberProgress);
      case 'groups':
        const groups = await prisma.group.findMany();
        return NextResponse.json(groups);
      case 'candidates':
        // This is a placeholder. You'll need to define how to model candidates.
        return NextResponse.json([]);
      case 'communion-schedule':
        const communionSchedule = await prisma.event.findMany({ where: { type: 'SERVICE' } });
        return NextResponse.json(communionSchedule);
      case 'prayer-requests':
        const prayerRequests = await prisma.prayerRequest.findMany();
        return NextResponse.json(prayerRequests);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const body = await request.json();

  try {
    switch (type) {
      case 'lessons':
        const newLesson = await prisma.lesson.create({ data: body });
        return NextResponse.json(newLesson);
      case 'prayer-requests':
        const newPrayerRequest = await prisma.prayerRequest.create({ data: body });
        return NextResponse.json(newPrayerRequest);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
