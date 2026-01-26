import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Security: Only authorized staff can create announcements
  if (!session || !session.user || 
      (!session.user.roles?.includes(RoleName.ADMIN) && 
       !session.user.roles?.includes(RoleName.COMMUNICATIONS_OFFICER) &&
       !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, tags, ministryId } = await req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        tags,
        ministryId,
      },
    });

    // Send push notification
    try {
        const userTokens = await prisma.fcmToken.findMany();
        const guestTokens = await prisma.token.findMany();
        const allTokens = [...userTokens.map(t => t.token), ...guestTokens.map(t => t.token)];

        if (allTokens.length > 0) {
          const message = {
            notification: { title: `New Announcement: ${title}`, body: content },
            tokens: allTokens,
          };
          await messaging.sendEachForMulticast(message);
          console.log("Announcement notification sent successfully.");
        }
    } catch (notificationError) {
        console.error("Error sending announcement notification:", notificationError);
        // Continue even if notification fails
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ministryId = searchParams.get("ministryId");

    const announcements = await prisma.announcement.findMany({
      where: ministryId ? { ministryId } : { ministryId: null },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}