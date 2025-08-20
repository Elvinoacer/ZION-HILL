import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { message: "Failed to delete certificate", error: error.message },
      { status: 500 }
    );
  }
}
