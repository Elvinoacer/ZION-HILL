import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { email: session.user.email ?? undefined },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to the last 50 transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching giving history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
