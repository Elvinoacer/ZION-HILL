import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        donationPlan: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, method, description, donationPlanId, userId, donorName, donorEmail, recurring } = body;

    if (!type || !amount || !method) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        method,
        description,
        donationPlan: donationPlanId
          ? { connect: { id: donationPlanId } }
          : undefined,
        user: userId ? { connect: { id: userId } } : undefined,
        donorName,
        donorEmail,
        recurring,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
