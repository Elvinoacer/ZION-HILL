import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // Optional: Add role-based access control
    // if (!session || !session.user.roles.includes('SENIOR_PASTOR')) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    const { id } = params;
    const { status } = await request.json();

    if (!id) {
      return new NextResponse("Request ID is required.", { status: 400 });
    }

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status provided.", { status: 400 });
    }

    const updatedRequest = await prisma.counselingSession.update({
      where: { id },
      data: {
        status: status === "APPROVED" ? "Scheduled" : "Cancelled",
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error(`Error updating counseling request ${params.id}:`, error);
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
