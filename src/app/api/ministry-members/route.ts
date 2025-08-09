import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const members = await prisma.ministryMember.findMany();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching ministry members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { ministryId, userId } = await request.json();
    const newMinistryMember = await prisma.ministryMember.create({
      data: {
        ministryId,
        userId,
      },
    });
    return NextResponse.json(newMinistryMember, { status: 201 });
  } catch (error) {
    console.error("Error adding ministry member:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { ministryId, userId } = await request.json();
    await prisma.ministryMember.delete({
      where: {
        ministryId_userId: {
          ministryId,
          userId,
        },
      },
    });
    return NextResponse.json({ message: "Ministry member removed successfully" });
  } catch (error) {
    console.error("Error removing ministry member:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
