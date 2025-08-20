import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path as needed

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { opportunityId } = await request.json();

    // Check if the user has already applied to this opportunity
    const existingApplication = await prisma.volunteeringApplication.findFirst({
      where: {
        opportunityId,
        applicantId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You have already applied to this opportunity", {
        status: 409,
      });
    }

    const newApplication = await prisma.volunteeringApplication.create({
      data: {
        opportunityId,
        applicantId: session.user.id,
      },
    });

    // Increment currentApplicants count in VolunteeringOpportunity
    await prisma.volunteeringOpportunity.update({
      where: { id: opportunityId },
      data: {
        currentApplicants: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteering application:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only coordinators and admins can view all applications
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    });

    let applications;
    if (
      user &&
      (user.roles.includes("VOLUNTEER_COORDINATOR") ||
        user.roles.includes("ADMIN"))
    ) {
      applications = await prisma.volunteeringApplication.findMany({
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              coordinatorId: true,
            },
          },
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          appliedAt: "desc",
        },
      });
    } else {
      // Regular users can only see their own applications
      applications = await prisma.volunteeringApplication.findMany({
        where: { applicantId: session.user.id },
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              coordinatorId: true,
            },
          },
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          appliedAt: "desc",
        },
      });
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching volunteering applications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
