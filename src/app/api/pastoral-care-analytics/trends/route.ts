import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real application, this would involve complex aggregation queries
    // on CounselingSession data to identify trends (e.g., most common issues).
    // For now, returning dummy data.
    const trends = [
      { id: 1, need: "Anxiety", count: 25 },
      { id: 2, need: "Grief", count: 18 },
      { id: 3, need: "Relationship Issues", count: 30 },
      { id: 4, need: "Depression", count: 22 },
      { id: 5, need: "Stress Management", count: 15 },
    ];
    return NextResponse.json(trends);
  } catch (error: any) {
    console.error("Error fetching trends data:", error);
    return NextResponse.json({ error: 'Failed to fetch trends data', details: error.message }, { status: 500 });
  }
}
