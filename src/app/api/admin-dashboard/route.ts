import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'stats':
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // Helper to calculate percentage change
        const calculateChange = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0; // If previous was 0 and current is > 0, it's 100% growth
          return ((current - previous) / previous) * 100;
        };

        // Total Members
        const totalMembersCurrent = await prisma.user.count({ where: { roles: { some: { name: 'members' } }, createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } } });
        const totalMembersPrevious = await prisma.user.count({ where: { roles: { some: { name: 'members' } }, createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth } } });
        const totalMembersChange = calculateChange(totalMembersCurrent, totalMembersPrevious);

        // Active Volunteers
        const activeVolunteersCurrent = await prisma.user.count({ where: { roles: { some: { name: 'Volunteer Coordinator' } }, createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } } });
        const activeVolunteersPrevious = await prisma.user.count({ where: { roles: { some: { name: 'Volunteer Coordinator' } }, createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth } } });
        const activeVolunteersChange = calculateChange(activeVolunteersCurrent, activeVolunteersPrevious);

        // Upcoming Events (still based on 'date' field, not 'createdAt')
        const upcomingEventsCurrent = await prisma.event.count({ where: { date: { gte: now } } });
        const upcomingEventsPrevious = await prisma.event.count({ where: { date: { gte: startOfPreviousMonth, lte: endOfPreviousMonth } } });
        const upcomingEventsChange = calculateChange(upcomingEventsCurrent, upcomingEventsPrevious);

        // Small Groups
        const smallGroupsCurrent = await prisma.group.count({ where: { createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } } });
        const smallGroupsPrevious = await prisma.group.count({ where: { createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth } } });
        const smallGroupsChange = calculateChange(smallGroupsCurrent, smallGroupsPrevious);

        return NextResponse.json({
          totalMembers: totalMembersCurrent,
          totalMembersChange: totalMembersChange.toFixed(2),
          activeVolunteers: activeVolunteersCurrent,
          activeVolunteersChange: activeVolunteersChange.toFixed(2),
          upcomingEvents: upcomingEventsCurrent,
          upcomingEventsChange: upcomingEventsChange.toFixed(2),
          smallGroups: smallGroupsCurrent,
          smallGroupsChange: smallGroupsChange.toFixed(2),
        });
      case 'ministries':
        const ministries = await prisma.ministry.findMany({ include: { leader: true } });
        return NextResponse.json(ministries);
      case 'tasks':
        const tasks = await prisma.ticket.findMany({ where: { status: 'Open' } });
        return NextResponse.json(tasks);
      case 'activity':
        const activity = await prisma.auditLog.findMany({ take: 10, orderBy: { timestamp: 'desc' } });
        return NextResponse.json(activity);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { type, taskId, status } = body;

  try {
    switch (type) {
      case 'task-status':
        if (!taskId || !status) {
          return NextResponse.json({ error: 'Task ID and status are required' }, { status: 400 });
        }
        const updatedTask = await prisma.ticket.update({
          where: { id: taskId },
          data: { status: status },
        });
        return NextResponse.json(updatedTask);
      default:
        return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
  }
}
