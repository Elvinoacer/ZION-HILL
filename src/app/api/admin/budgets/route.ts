import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// Helper to get the current fiscal year (assuming calendar year for simplicity)
const getCurrentFiscalYear = () => new Date().getFullYear();

export async function GET() {
  try {
    const fiscalYear = getCurrentFiscalYear();

    // Fetch all ministries
    const ministries = await prisma.ministry.findMany();

    // Fetch existing budgets for the current fiscal year
    const existingBudgets = await prisma.ministryBudget.findMany({
      where: { fiscalYear },
    });

    // Map ministries to their budgets, creating default if not found
    const ministryBudgets = ministries.map((ministry) => {
      const budget = existingBudgets.find((b) => b.ministryId === ministry.id);
      return {
        id: ministry.id,
        name: ministry.name,
        allocatedBudget: budget?.allocatedAmount || 0,
        spent: budget?.spentAmount || 0,
        budgetRecordId: budget?.id || null, // ID of the budget record if it exists
        fiscalYear: fiscalYear,
      };
    });

    return NextResponse.json(ministryBudgets);
  } catch (error) {
    console.error("Error fetching ministry budgets:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch ministry budgets",
        error: (error as any).message || (error as any).toString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { ministryId, allocatedAmount, fiscalYear } = await request.json();

    const newBudget = await prisma.ministryBudget.create({
      data: {
        ministryId,
        allocatedAmount,
        fiscalYear,
        spentAmount: 0, // Initialize spent amount to 0
        status: "PENDING",
      },
    });

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating ministry budget:", error);
    return NextResponse.json(
      {
        message: "Failed to create ministry budget",
        error: (error as any).message || (error as any).toString(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { budgetRecordId, allocatedAmount, spentAmount, status } =
      await request.json();

    if (!budgetRecordId) {
      return NextResponse.json(
        { message: "Budget record ID is required for update" },
        { status: 400 }
      );
    }

    const updatedBudget = await prisma.ministryBudget.update({
      where: { id: budgetRecordId },
      data: {
        allocatedAmount,
        spentAmount,
        status,
      },
    });

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Error updating ministry budget:", error);
    return NextResponse.json(
      {
        message: "Failed to update ministry budget",
        error: (error as any).message || (error as any).toString(),
      },
      { status: 500 }
    );
  }
}
