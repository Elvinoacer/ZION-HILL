import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { roleId } = await request.json();

    // Disconnect all existing roles for the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: { set: [] },
      },
    });

    // Connect the new role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { id: roleId },
        },
      },
      include: { roles: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
