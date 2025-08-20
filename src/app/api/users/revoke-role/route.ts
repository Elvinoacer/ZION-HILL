import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoleName } from "@/generated/prisma";

export async function PUT(request: Request) {
  const body = await request.json();
  const { userId, roleName } = body;

  if (!userId || !roleName) {
    return NextResponse.json({ error: "User ID and Role Name are required" }, { status: 400 });
  }

  // Validate if roleName is a valid RoleName enum value
  if (!Object.values(RoleName).includes(roleName)) {
    return NextResponse.json({ error: "Invalid Role Name" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove the role from the user's roles array
    const updatedRoles = user.roles.filter((role) => role !== roleName);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: updatedRoles,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error revoking user role:", error);
    return NextResponse.json({ error: "Error revoking user role" }, { status: 500 });
  }
}
