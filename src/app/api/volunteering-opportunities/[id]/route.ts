import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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