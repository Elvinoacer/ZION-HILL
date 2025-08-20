import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return new NextResponse("Missing status", { status: 400 });
    }

    const updatedRequest = await prisma.financialSupportRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error(
      `Error updating financial support request ${params.id}:`,
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
