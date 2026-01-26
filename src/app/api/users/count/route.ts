import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json(
      { message: "Failed to fetch user count" },
      { status: 500 }
    );
  }
}
