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

    const { token, userId, deviceType } = await req.json();

    if (!token || !userId) {
      return new NextResponse("Missing token or userId", { status: 400 });
    }

    if (userId !== session.user.id) {
      return new NextResponse("Forbidden: User ID mismatch", { status: 403 });
    }

    // Upsert the token: create if new, update lastSeenAt if existing
    await prisma.fcmToken.upsert({
      where: { token },
      update: {
        lastSeenAt: new Date(),
        userId, // update userId just in case, though it should match if token is unique per device
        deviceType: deviceType || null,
      },
      create: {
        token,
        userId,
        deviceType: deviceType || null,
      },
    });

    return new NextResponse("Token saved and refreshed", { status: 200 });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
