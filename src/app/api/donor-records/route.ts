import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        type: "DONATION",
        reconciliationStatus: "APPROVED",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        donationPlan: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const donorRecords = transactions.map((transaction) => ({
      id: transaction.id,
      donorName: transaction.donorName || "Anonymous",
      date: transaction.date.toISOString(),
      amount: transaction.amount,
      planName: transaction.donationPlan?.name || "N/A",
    }));

    return NextResponse.json(donorRecords);
  } catch (error) {
    console.error("Error fetching donor records:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
