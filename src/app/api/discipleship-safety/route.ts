
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'activities':
        // This is a placeholder. You'll need to define how to model activities.
        return NextResponse.json([]);
      case 'children':
        const children = await prisma.user.findMany({ where: { roles: { some: { name: 'GUEST' } } } });
        return NextResponse.json(children);
      case 'volunteers':
        const volunteers = await prisma.user.findMany({ where: { roles: { some: { name: 'VOLUNTEER' } } } });
        return NextResponse.json(volunteers);
      case 'trainings':
        // This is a placeholder. You'll need to define how to model trainings.
        return NextResponse.json([]);
      case 'lessons':
        const lessons = await prisma.lesson.findMany();
        return NextResponse.json(lessons);
      case 'milestones':
        // This is a placeholder. You'll need to define how to model milestones.
        return NextResponse.json([]);
      case 'rooms':
        const rooms = await prisma.resource.findMany({ where: { type: 'VENUE' } });
        return NextResponse.json(rooms);
      case 'incidents':
        const incidents = await prisma.ticket.findMany();
        return NextResponse.json(incidents);
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
      case 'check-in':
        const checkedInUser = await prisma.volunteerShift.update({ where: { id: body.id }, data: { checkedIn: true } });
        return NextResponse.json(checkedInUser);
      case 'check-clearance':
        // In a real app, you'd check the volunteer's clearance
        return NextResponse.json({ message: 'Clearance checked' });
      case 'complete-training':
        // In a real app, you'd complete the training
        return NextResponse.json({ message: 'Training completed' });
      case 'send-parent-email':
        // In a real app, you'd send a parent email
        return NextResponse.json({ message: 'Parent email sent' });
      case 'celebrate-milestone':
        // In a real app, you'd celebrate the milestone
        return NextResponse.json({ message: 'Milestone celebrated' });
      case 'report-incident':
        const newIncident = await prisma.ticket.create({ data: body });
        return NextResponse.json(newIncident);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
