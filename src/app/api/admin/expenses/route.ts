import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const expenses = await prisma.transaction.findMany({
      where: {
        type: 'EXPENSE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        donationPlan: {
          include: {
            fund: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { message: "Failed to fetch expenses", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, reconciliationStatus } = await request.json();

    if (!id || !reconciliationStatus) {
      return NextResponse.json(
        { message: "Missing expense ID or reconciliation status" },
        { status: 400 }
      );
    }

    const updatedExpense = await prisma.transaction.update({
      where: { id },
      data: { reconciliationStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        donationPlan: {
          include: {
            fund: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense status:", error);
    return NextResponse.json(
      { message: "Failed to update expense status", error: error.message },
      { status: 500 }
    );
  }
}
