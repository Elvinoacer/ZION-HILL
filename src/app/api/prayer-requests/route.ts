import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let userId = searchParams.get("userId");

  // Privacy: generic users only see their own requests. Pastors/Admins see all.
  const isPrivileged = session.user.roles?.includes(RoleName.ADMIN) || 
                       session.user.roles?.includes(RoleName.SENIOR_PASTOR) || 
                       session.user.roles?.includes(RoleName.OUTREACH_PASTOR) ||
                       session.user.roles?.includes(RoleName.COUNSELING_COORDINATOR);

  if (!isPrivileged) {
      userId = session.user.id;
  }

  const whereClause: any = {};
  if (userId) whereClause.userId = userId;

  try {
    const prayerRequests = await prisma.prayerRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(prayerRequests);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
