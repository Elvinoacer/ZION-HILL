import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path as needed

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || userId !== session.user.id) {
      return new NextResponse(
        "Forbidden: You can only view your own counseling sessions.",
        { status: 403 }
      );
    }

    const counselingSessions = await prisma.counselingSession.findMany({
      where: {
        clientId: userId,
      },
      select: {
        id: true,
        status: true,
        date: true,
        topic: true,
        counselor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(counselingSessions);
  } catch (error) {
    console.error("Error fetching user counseling sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
