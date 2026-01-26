import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");

    if (!userId) {
      userId = session.user.id;
    }

    // Security: Generic users can only see their own family association. Admins see all.
    if (
      userId !== session.user.id &&
      !session.user.roles?.includes(RoleName.ADMIN)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const families = await prisma.family.findMany({
      where: {
        OR: [{ members: { some: { id: userId } } }, { createdById: userId }],
      },
      include: {
        members: true,
        createdBy: { select: { id: true, name: true, createdAt: true } },
      },
    });
    return NextResponse.json(families);
  } catch (error) {
    console.error("Error fetching family data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Security: Only create family for self as first member
    const newFamily = await prisma.family.create({
      data: {
        name: body.name,
        createdById: session.user.id,
        members: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    return NextResponse.json(newFamily);
  } catch (error) {
    console.error("Error creating family:", error);
    return NextResponse.json({ error: "Error creating data" }, { status: 500 });
  }
}
