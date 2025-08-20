import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
