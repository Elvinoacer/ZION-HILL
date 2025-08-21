import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const ministryName = searchParams.get("ministryName");

  if (!userId || !ministryName) {
    return NextResponse.json({ error: "userId and ministryName are required" }, { status: 400 });
  }

  try {
    const ministry = await prisma.ministry.findFirst({
      where: {
        name: ministryName,
      },
      include: {
        members: {
          where: {
            userId: userId,
            active: true, // Only consider active members
          },
        },
      },
    });

    const isMember = ministry ? ministry.members.length > 0 : false;

    return NextResponse.json({ isMember });
  } catch (error) {
    console.error("Error checking ministry membership:", error);
    return NextResponse.json({ error: "Failed to check ministry membership" }, { status: 500 });
  }
}
