import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real application, this would involve querying CounselingSession
    // data and potentially a separate survey/follow-up model.
    // For now, returning dummy data.
    const followUps = [
      { id: 1, memberId: "user123", days: 30, response: "Feeling better", sessionDate: "2023-10-01" },
      { id: 2, memberId: "user456", days: 60, response: "Stable progress", sessionDate: "2023-09-15" },
      { id: 3, memberId: "user789", days: 90, response: "Needs follow-up", sessionDate: "2023-08-20" },
    ];
    return NextResponse.json(followUps);
  } catch (error: any) {
    console.error("Error fetching follow-up data:", error);
    return NextResponse.json({ error: 'Failed to fetch follow-up data', details: error.message }, { status: 500 });
  }
}
