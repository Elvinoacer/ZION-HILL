import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { transactionId } = await request.json();

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: transaction.reconciliationStatus });
  } catch (error: any) {
    console.error("Transaction Status Error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to get transaction status",
      },
      { status: 500 }
    );
  }
}
