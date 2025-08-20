import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, type, imageUrl, requiredPeople, customFields } =
      await request.json();

    // Check if the user is a VOLUNTEER_COORDINATOR
    // const user = await prisma.user.findUnique({
    //   where: { id: session.user.id },
    //   select: { roles: true },
    // });

    // SECURITY NOTE: Uncomment the following lines to enforce role-based access control
    // if (!user || !user.roles.includes("VOLUNTEER_COORDINATOR")) {
    //   return new NextResponse(
    //     "Forbidden: Only Volunteer Coordinators can create opportunities",
    //     { status: 403 }
    //   );
    // }

    const newOpportunity = await prisma.volunteeringOpportunity.create({
      data: {
        title,
        description,
        type,
        imageUrl,
        requiredPeople: parseInt(requiredPeople, 10) || 0,
        coordinatorId: session.user.id,
        customFields,
      },
    });

    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteering opportunity:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAssigned = searchParams.get("showAssigned") === "true";

    const opportunities = await prisma.volunteeringOpportunity.findMany({
      where: showAssigned ? {} : { isAssigned: false },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Error fetching volunteering opportunities:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
