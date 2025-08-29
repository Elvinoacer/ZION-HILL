import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subMonths, startOfMonth } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const oneMonthAgo = subMonths(now, 1);
    const startOfThisMonth = startOfMonth(now);

    const totalUsers = await prisma.user.count();
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfThisMonth,
        },
      },
    });

    const totalUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          lt: startOfThisMonth,
        },
      },
    });

    const monthlyGrowth =
      totalUsersLastMonth > 0
        ? ((totalUsers - totalUsersLastMonth) / totalUsersLastMonth) * 100
        : totalUsers > 0
        ? 100
        : 0;

    const newBelievers = await prisma.user.count({
      where: {
        christian: true,
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    const smallGroups = await prisma.group.count();
    const bibleStudies = await prisma.bibleStudyCourse.count();

    // Weekly Attendance: This is a bit more complex.
    // Let's assume attendance is tracked by participation in 'SERVICE' type events.
    // We'll calculate the average weekly attendance over the last month.
    const lastMonthServices = await prisma.event.findMany({
      where: {
        type: "SERVICE",
        date: {
          gte: oneMonthAgo,
        },
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    const totalAttendanceLastMonth = lastMonthServices.reduce(
      (sum, service) => sum + service._count.participants,
      0
    );
    const weeklyAttendance =
      lastMonthServices.length > 0 ? totalAttendanceLastMonth / 4 : 0; // Approximate weekly average

    return NextResponse.json({
      weeklyAttendance: Math.round(weeklyAttendance),
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2)),
      newBelievers,
      smallGroups,
      bibleStudies,
    });
  } catch (error) {
    console.error("Error fetching spiritual growth metrics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
