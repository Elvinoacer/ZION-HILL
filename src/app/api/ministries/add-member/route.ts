import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@/generated/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR) && !session.user.roles?.includes(RoleName.OVERALL_MINISTRIES_COORDINATOR))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ministryId, userId } = await req.json();

    if (!ministryId || !userId) {
      return NextResponse.json(
        { error: "Ministry ID and User ID are required" },
        { status: 400 }
      );
    }

    // Check if the user is already a member of the ministry
    const existingMember = await prisma.ministryMember.findUnique({
      where: {
        ministryId_userId: {
          ministryId,
          userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this ministry" },
        { status: 409 }
      );
    }

    const ministryMember = await prisma.ministryMember.create({
      data: {
        ministryId,
        userId,
      },
    });

    return NextResponse.json(ministryMember);
  } catch (error) {
    console.error("Failed to add ministry member", error);
    return NextResponse.json(
      { error: "Failed to add ministry member" },
      { status: 500 }
    );
  }
}
