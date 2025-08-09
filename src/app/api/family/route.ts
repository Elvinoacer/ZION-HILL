import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User Id is require" },
        { status: 401 }
      );
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
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newFamily = await prisma.family.create({
      data: {
        name: body.name,
        createdById: body.member.id,
        members: {
          connect: {
            id: body.member.id,
          },
        },
      },
    });
    return NextResponse.json(newFamily);
  } catch (error) {
    return NextResponse.json({ error: "Error creating data" }, { status: 500 });
  }
}
