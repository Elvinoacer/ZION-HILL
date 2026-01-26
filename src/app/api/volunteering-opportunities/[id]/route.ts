import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const opportunity = await prisma.volunteeringOpportunity.findUnique({
      where: { id: params.id },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          include: {
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
    });

    if (!opportunity) {
      return new NextResponse("Opportunity not found", { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error(
      `Error fetching volunteering opportunity with ID: ${params.id}`,
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, description, type, imageUrl, requiredPeople, customFields, isAssigned } = body;

    const updatedOpportunity = await prisma.volunteeringOpportunity.update({
      where: { id: params.id },
      data: {
        title,
        description,
        type,
        imageUrl,
        requiredPeople: requiredPeople ? parseInt(requiredPeople, 10) : undefined,
        customFields,
        isAssigned,
      },
    });

    return NextResponse.json(updatedOpportunity);
  } catch (error) {
    console.error(`Error updating volunteering opportunity with ID: ${params.id}`, error);
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

    await prisma.volunteeringOpportunity.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting volunteering opportunity with ID: ${params.id}`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
