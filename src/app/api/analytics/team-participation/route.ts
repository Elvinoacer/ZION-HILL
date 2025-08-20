import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teamParticipation = await prisma.ministryMember.groupBy({
      by: ['ministryId', 'role'],
      _count: {
        userId: true,
      },
      where: {
        active: true,
      },
    });

    const result = [];
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FFC0CB"];
    let colorIndex = 0;

    for (const item of teamParticipation) {
      const ministry = await prisma.ministry.findUnique({
        where: { id: item.ministryId },
        select: { name: true },
      });

      const name = item.role ? `${ministry?.name || 'Unknown Ministry'} - ${item.role}` : ministry?.name || 'Unknown Ministry';

      result.push({
        name: name,
        value: item._count.userId,
        color: colors[colorIndex % colors.length],
      });
      colorIndex++;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching team participation data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch team participation data" },
      { status: 500 }
    );
  }
}