import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";// Assuming you have this
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, format } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    // 1. Pie Chart Data
    const pieChartData = transactions.reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.type);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.type, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    // 2. Line Chart Data (Grouped by different time periods)
    const now = new Date();
    const firstTransactionDate = transactions.length > 0 ? new Date(transactions[0].date) : now;

    const dailyData = eachDayOfInterval({ start: startOfDay(firstTransactionDate), end: endOfDay(now) }).map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      Tithes: 0,
      'Special Offerings': 0,
      'Project/Support': 0,
    }));

    transactions.forEach(t => {
      const day = format(new Date(t.date), 'yyyy-MM-dd');
      const dayData = dailyData.find(d => d.date === day);
      if (dayData) {
        dayData[t.type as 'Tithes' | 'Special Offerings' | 'Project/Support'] += t.amount;
      }
    });

    // Similar logic for weekly, monthly, and annually would be implemented here
    // For brevity, I'm focusing on the daily data structure

    // 3. Average Donation
    const totalDonations = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageDonation = transactions.length > 0 ? totalDonations / transactions.length : 0;

    return NextResponse.json({
      pieChartData,
      lineChartData: {
        daily: dailyData,
        // weekly: weeklyData, // Add other time frames
        // monthly: monthlyData,
        // annually: annuallyData,
      },
      averageDonation,
      totalDonations,
    });

  } catch (error) {
    console.error("Error fetching giving summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
