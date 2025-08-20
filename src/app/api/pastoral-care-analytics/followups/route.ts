import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is available here

export async function GET() {
  try {
    const followUps = await prisma.followUp.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true, // Include user name for display
          },
        },
      },
      orderBy: {
        followUpDate: "desc",
      },
    });

    // Map the results to the format expected by the frontend
    const formattedFollowUps = followUps.map((fu) => ({
      id: fu.id,
      memberId: fu.user.name || fu.userId, // Use user name if available, otherwise ID
      days: fu.days,
      response: fu.response,
      sessionDate: fu.followUpDate.toISOString(), // Ensure ISO string for date
    }));

    return NextResponse.json(formattedFollowUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { message: "Error fetching follow-ups" },
      { status: 500 }
    );
  }
}
