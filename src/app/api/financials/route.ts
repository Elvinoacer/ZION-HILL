import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const financials = await prisma.financials.findMany();
    return NextResponse.json(financials);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching financials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newFinancials = await prisma.financials.create({ data: body });
    return NextResponse.json(newFinancials, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating financials" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Financials ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedFinancials = await prisma.financials.update({
      where: { id },
      data: { ...body },
    });
    return NextResponse.json(updatedFinancials);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating financials" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Financials ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.financials.delete({ where: { id } });
    return NextResponse.json({ message: "Financials deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting financials" },
      { status: 500 }
    );
  }
}
