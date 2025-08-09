import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const families = await prisma.family.findMany({
      include: {
        members: { select: { id: true, name: true, email: true, photo: true } },
        createdBy: { select: { id: true, name: true, createdAt: true } },
      },
    });

    return NextResponse.json(families);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
