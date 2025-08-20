import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let financialSetting = await prisma.financialSetting.findFirst();

    if (!financialSetting) {
      // If no setting exists, create a default one
      financialSetting = await prisma.financialSetting.create({
        data: {
          annualBudgetLimit: 0, // Default to 0 if not set
        },
      });
    }

    return NextResponse.json(financialSetting);
  } catch (error: any) {
    console.error('Error fetching financial settings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch financial settings', error: error.message || error.toString() },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { annualBudgetLimit } = await request.json();

    // Find the existing setting or create one if it doesn't exist
    let financialSetting = await prisma.financialSetting.findFirst();

    if (financialSetting) {
      // Update existing setting
      financialSetting = await prisma.financialSetting.update({
        where: { id: financialSetting.id },
        data: { annualBudgetLimit: parseFloat(annualBudgetLimit) },
      });
    } else {
      // Create new setting if it doesn't exist
      financialSetting = await prisma.financialSetting.create({
        data: { annualBudgetLimit: parseFloat(annualBudgetLimit) },
      });
    }

    return NextResponse.json(financialSetting);
  } catch (error: any) {
    console.error('Error updating financial settings:', error);
    return NextResponse.json(
      { message: 'Failed to update financial settings', error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
