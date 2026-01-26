import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoleName } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const counselors = await prisma.user.findMany({
      where: {
        roles: {
          has: RoleName.COUNSELOR,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });
    return NextResponse.json(counselors);
  } catch (error) {
    console.error("Error fetching counselors:", error);
    return NextResponse.json({ error: "Error fetching counselors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.roles.includes(RoleName.COUNSELOR)) {
      return NextResponse.json({ message: "User is already a counselor" }, { status: 200 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          push: RoleName.COUNSELOR,
        },
      },
      select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          isActive: true,
          profileComplete: true,
          createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error adding counselor:", error);
    return NextResponse.json({ error: "Error adding counselor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.roles.includes(RoleName.COUNSELOR)) {
      return NextResponse.json({ message: "User is not a counselor" }, { status: 200 });
    }

    const updatedRoles = user.roles.filter(
      (role) => role !== RoleName.COUNSELOR
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: updatedRoles,
      },
      select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          isActive: true,
          profileComplete: true,
          createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error deleting counselor:", error);
    return NextResponse.json({ error: "Error deleting counselor" }, { status: 500 });
  }
}

