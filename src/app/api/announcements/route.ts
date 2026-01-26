import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@/generated/prisma";
import { sendNotification } from "@/lib/notification-service";

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
      // Fetch all active users for broadcast
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      const userIds = users.map((u) => u.id);

      if (userIds.length > 0) {
        // Use batching if necessary, but sendNotification handles basic multicast
        // Ideally we might want to chunk this for very large user bases, 
        // but for now we pass the list to the service which uses token query with 'in'.
        // Note: Prisma 'in' query limit is high, but Firestore multicast limit is 500.
        // We might need to handle chunking in the service later if not present.
        // For simple implementations, sending all IDs is okay if under a few thousand.
        
        await sendNotification({
          userIds,
          title: `New Announcement: ${title}`,
          body: content.substring(0, 100), // Truncate body for notification
          data: {
            url: "/announcements",
            announcementId: announcement.id,
          },
        });
      }
    } catch (notificationError) {
      console.error(
        "Error sending announcement notification:",
        notificationError
      );
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