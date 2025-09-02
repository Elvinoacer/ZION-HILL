import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const givingHistory = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: "GIVING",
        reconciliationStatus: "APPROVED",
      },
      include: {
        giving: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedHistory = givingHistory.map((item) => ({
      id: item.id,
      date: item.date.toISOString(),
      type: item.giving?.name || "General Donation",
      amount: item.amount,
      method: item.method,
      status: item.reconciliationStatus,
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("Error fetching giving history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
