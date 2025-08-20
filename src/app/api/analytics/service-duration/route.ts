import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const monthlyServiceCounts = [];

    for (let i = 0; i < 12; i++) {
      const month = i; // 0-indexed for JavaScript Date
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0); // Last day of the month

      const count = await prisma.event.count({
        where: {
          type: "SERVICE",
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      monthlyServiceCounts.push({
        name: startDate.toLocaleString('default', { month: 'short' }),
        duration: count, // Using count as a proxy for duration trend
      });
    }

    return NextResponse.json(monthlyServiceCounts);
  } catch (error: any) {
    console.error("Error fetching service duration data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch service duration data" },
      { status: 500 }
    );
  }
}