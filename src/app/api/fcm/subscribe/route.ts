import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { token, userId } = await req.json();

    if (!token || !userId) {
      return new NextResponse("Missing token or userId", { status: 400 });
    }

    if (userId !== session.user.id) {
      return new NextResponse("Forbidden: User ID mismatch", { status: 403 });
    }

    // Check if the token already exists for this user
    const existingToken = await prisma.fcmToken.findFirst({
      where: {
        token: token,
        userId: userId,
      },
    });

    if (existingToken) {
      return new NextResponse("Token already exists for this user", { status: 200 });
    }

    // Create new token
    await prisma.fcmToken.create({
      data: {
        userId,
        token,
      },
    });

    return new NextResponse("Token saved", { status: 200 });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
