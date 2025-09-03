import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, goalAmount } = body;

    const updatedGiving = await prisma.giving.update({
      where: { id },
      data: {
        name,
        description,
        goalAmount,
      },
    });

    return NextResponse.json(updatedGiving);
  } catch (error) {
    console.error("Error updating giving:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.giving.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting giving:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}