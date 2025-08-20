import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const donationPlan = await prisma.donationPlan.findUnique({
      where: { id },
      include: {
        transactions: {
          where: {
            reconciliationStatus: "APPROVED",
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!donationPlan) {
      return new NextResponse("Donation plan not found", { status: 404 });
    }

    return NextResponse.json(donationPlan);
  } catch (error) {
    console.error(`Error fetching donation plan ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.donationPlan.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting donation plan ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, goalAmount, type, imageUrl } = body;

    const updatedDonationPlan = await prisma.donationPlan.update({
      where: { id },
      data: {
        name,
        description,
        goalAmount,
        type,
        imageUrl,
      },
    });

    return NextResponse.json(updatedDonationPlan);
  } catch (error) {
    console.error(`Error updating donation plan ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
