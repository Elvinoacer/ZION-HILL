import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || userId !== session.user.id) {
    return new NextResponse(
      "Forbidden: You can only view your own new volunteering opportunities count.",
      { status: 403 }
    );
  }

  try {
    // Get all volunteering opportunities
    const allOpportunities = await prisma.volunteeringOpportunity.findMany({
      select: {
        id: true,
      },
    });

    // Get all applications for the current user
    const userApplications = await prisma.volunteeringApplication.findMany({
      where: {
        applicantId: userId,
      },
      select: {
        opportunityId: true,
      },
    });

    // Extract IDs of opportunities the user has applied to
    const appliedOpportunityIds = new Set(
      userApplications.map((app) => app.opportunityId)
    );

    // Filter opportunities that the user has not applied to
    const newOpportunities = allOpportunities.filter(
      (opportunity) => !appliedOpportunityIds.has(opportunity.id)
    );

    return NextResponse.json(newOpportunities.length);
  } catch (error) {
    console.error("Error fetching new volunteering opportunities count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
