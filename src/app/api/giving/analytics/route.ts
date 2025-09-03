import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const givingTransactions = await prisma.transaction.findMany({
      where: {
        type: "GIVING",
        reconciliationStatus: "APPROVED",
      },
      include: {
        user: true,
        giving: true,
      },
    });

    const totalGiving = givingTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const numberOfGivers = new Set(givingTransactions.map((t) => t.userId))
      .size;

    const averageGiving = totalGiving / (givingTransactions.length || 1);

    return NextResponse.json({
      totalGiving,
      numberOfGivers,
      averageGiving,
      givingHistory: givingTransactions,
    });
  } catch (error) {
    console.error("Error fetching giving analytics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
