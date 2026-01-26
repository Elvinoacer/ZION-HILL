import { NextResponse } from "next/server";
import { RoleName } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  // if (!session?.user?.roles?.includes(RoleName.COUNSELOR)) {
  //   return new NextResponse(
  //     "Forbidden: You do not have access to this resource.",
  //     { status: 403 }
  //   );
  // }

  try {
    const counselingRequests = await prisma.counselingSession.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        client: {
          select: { name: true, email: true },
        },
        counselor: {
          select: { name: true, email: true },
        },
      },
    });
    return NextResponse.json(counselingRequests);
  } catch (error) {
    console.error("Error fetching counseling requests:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  // if (!session?.user?.roles?.includes(RoleName.COUNSELOR)) {
  //   return new NextResponse(
  //     "Forbidden: You do not have access to this resource.",
  //     { status: 403 }
  //   );
  // }

  try {
    const { id, status, date, notes, progress, counselorId } = await request.json();

    if (!id) {
      return new NextResponse("Missing session ID", { status: 400 });
    }

    const dataToUpdate: {
      status?: string;
      date?: Date;
      notes?: string;
      progress?: number;
      counselorId?: string;
    } = {};

    if (status !== undefined) {
      dataToUpdate.status = status;
    }
    if (date !== undefined) {
      dataToUpdate.date = new Date(date);
    }
    if (notes !== undefined) {
      dataToUpdate.notes = notes;
    }
    if (progress !== undefined) {
      dataToUpdate.progress = progress;
    }
    if (counselorId !== undefined) {
      dataToUpdate.counselorId = counselorId;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    const updatedSession = await prisma.counselingSession.update({
      where: { id },
      data: dataToUpdate,
      include: {
        client: {
          select: { name: true, email: true },
        },
        counselor: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating counseling session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
