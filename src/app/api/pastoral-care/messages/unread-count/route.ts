import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const unreadCount = await prisma.message.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread message count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
