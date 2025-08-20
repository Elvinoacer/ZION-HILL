import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoleName } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  // Ensure the role is a valid RoleName enum value
  if (!(role in RoleName)) {
    return NextResponse.json({ error: "Invalid role provided" }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        roles: {
          has: role as RoleName,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(`Error fetching users by role ${role}:`, error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
