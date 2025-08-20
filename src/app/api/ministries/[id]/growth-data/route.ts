import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, getMonth, getYear, addMonths } from 'date-fns';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const ministryId = params.id;

  try {
    const ministryMembers = await prisma.ministryMember.findMany({
      where: { ministryId },
      select: {
        joinDate: true,
      },
      orderBy: { joinDate: 'asc' },
    });

    // Aggregate member count by month
    const monthlyDataMap = new Map();

    ministryMembers.forEach(member => {
      const joinDate = new Date(member.joinDate);
      const monthKey = format(startOfMonth(joinDate), 'yyyy-MM'); // e.g., "2023-01"

      if (!monthlyDataMap.has(monthKey)) {
        monthlyDataMap.set(monthKey, { members: 0 });
      }
      monthlyDataMap.get(monthKey).members++;
    });

    // Convert map to array and ensure all months are present (for a continuous chart)
    const growthData = [];
    let currentDate = new Date(ministryMembers[0]?.joinDate || new Date());
    const endDate = new Date();

    while (currentDate <= endDate) {
      const monthKey = format(startOfMonth(currentDate), 'yyyy-MM');
      const monthLabel = format(currentDate, 'MMM');
      const yearLabel = format(currentDate, 'yy');

      const data = monthlyDataMap.get(monthKey);
      growthData.push({
        month: `${monthLabel}-${yearLabel}`,
        members: data ? data.members : 0,
      });

      currentDate = addMonths(currentDate, 1);
    }

    return NextResponse.json(growthData);
  } catch (error) {
    console.error(`Error fetching growth data for ministry ${ministryId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch growth data' }, { status: 500 });
  }
}
