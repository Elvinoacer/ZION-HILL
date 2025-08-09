import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { familyId } = await request.json();
    const userId = searchParams.get("id");
    const type = searchParams.get("type");
    if (!userId || !familyId)
      return NextResponse.json(
        { message: "Please provide userId or familyId" },
        { status: 404 }
      );
    if (type === "remove") {
      const updatedUser = await prisma.family.update({
        where: { id: familyId },
        data: { members: { disconnect: { id: userId } } },
      });
      return NextResponse.json(updatedUser);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        familyId,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({
      error:
        error instanceof Error
          ? error.message
          : "Unexpected server error occured",
    });
  }
}
