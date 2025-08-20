import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const donationPlans = await prisma.donationPlan.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        transactions: {
          where: {
            reconciliationStatus: "APPROVED",
          },
          select: {
            amount: true,
          },
        },
      },
    });
    return NextResponse.json(donationPlans);
  } catch (error) {
    console.error("Error fetching donation plans:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, goalAmount, type, imageUrl } = body;

    if (!name || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newDonationPlan = await prisma.donationPlan.create({
      data: {
        name,
        description,
        goalAmount,
        type,
        imageUrl,
      },
    });

    return NextResponse.json(newDonationPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating donation plan:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
