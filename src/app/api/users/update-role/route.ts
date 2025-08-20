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

    // Add the new role if it's not already present
    const updatedRoles = user.roles.includes(roleName) ? user.roles : [...user.roles, roleName];

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: updatedRoles,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Error updating user role" }, { status: 500 });
  }
}
