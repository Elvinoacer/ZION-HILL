import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const { status, coordinatorNotes } = await request.json();

    // Fetch the application and its associated opportunity
    const application = await prisma.volunteeringApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: {
            coordinatorId: true,
            requiredPeople: true,
            assignedPeople: true,
          },
        },
      },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Check if the user is the coordinator of the opportunity or an ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    });

    if (
      application.opportunity.coordinatorId !== session.user.id &&
      (!user || !user.roles.includes("ADMIN"))
    ) {
      return new NextResponse(
        "Forbidden: You are not authorized to update this application",
        { status: 403 }
      );
    }

    // Handle status change logic
    let updatedAssignedPeople = application.opportunity.assignedPeople;
    let updatedIsAssigned =
      application.opportunity.assignedPeople >=
      application.opportunity.requiredPeople;

    if (status === "APPROVED" && application.status !== "APPROVED") {
      // Only increment if changing to APPROVED from a non-approved status
      updatedAssignedPeople += 1;
      if (updatedAssignedPeople >= application.opportunity.requiredPeople) {
        updatedIsAssigned = true;
      }
    } else if (status !== "APPROVED" && application.status === "APPROVED") {
      // Only decrement if changing from APPROVED to a non-approved status
      updatedAssignedPeople = Math.max(0, updatedAssignedPeople - 1);
      updatedIsAssigned = false; // If someone is unapproved, it's no longer fully assigned
    }

    const updatedApplication = await prisma.volunteeringApplication.update({
      where: { id },
      data: {
        status,
        coordinatorNotes,
      },
    });

    // Update the associated VolunteeringOpportunity
    await prisma.volunteeringOpportunity.update({
      where: { id: application.opportunityId },
      data: {
        assignedPeople: updatedAssignedPeople,
        isAssigned: updatedIsAssigned,
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating volunteering application:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const application = await prisma.volunteeringApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: {
            coordinatorId: true,
            assignedPeople: true,
            requiredPeople: true,
          },
        },
      },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Check if the user is the coordinator of the opportunity or an ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    });

    if (
      application.opportunity.coordinatorId !== session.user.id &&
      (!user || !user.roles.includes("ADMIN"))
    ) {
      return new NextResponse(
        "Forbidden: You are not authorized to delete this application",
        { status: 403 }
      );
    }

    // If the application being deleted was approved, decrement assignedPeople
    if (application.status === "APPROVED") {
      await prisma.volunteeringOpportunity.update({
        where: { id: application.opportunityId },
        data: {
          assignedPeople: {
            decrement: 1,
          },
          isAssigned: false, // If an approved application is deleted, it's no longer fully assigned
        },
      });
    }

    // Decrement currentApplicants count in VolunteeringOpportunity
    await prisma.volunteeringOpportunity.update({
      where: { id: application.opportunityId },
      data: {
        currentApplicants: {
          decrement: 1,
        },
      },
    });

    await prisma.volunteeringApplication.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting volunteering application:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
