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
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.SENIOR_PASTOR);
  const isSelf = session.user.id === id;
  const canSeePII = isAdmin || isSelf;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        roles: true,
        createdAt: true,
        // Sensitive fields explicitly controlled by boolean flag
        email: canSeePII,
        phone: canSeePII,
        address: canSeePII,
        membersince: canSeePII,
        birthdate: canSeePII,
        photo: canSeePII,
        christian: canSeePII,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
