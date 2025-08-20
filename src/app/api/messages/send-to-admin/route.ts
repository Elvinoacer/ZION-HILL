import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageType } from "@/generated/prisma";
import webpush from "web-push";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:omondielvin@gmail.com",
  process.env.WEB_PUSH_PUBLIC_KEY || "",
  process.env.WEB_PUSH_PRIVATE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId, message, subject } = await req.json();

    if (!eventId || !message || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, message, subject" },
        { status: 400 }
      );
    }

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Fetch sender details if userId is provided
    let senderId = userId; // Use userId directly as senderId
    if (!senderId) {
      return NextResponse.json(
        { error: "User must be logged in to send a message" },
        { status: 401 }
      );
    }

    // Find the Events Manager's User ID
    let recipientId: string | null = null;

    const eventsManagerRole = await prisma.role.findFirst({
      where: { name: "Events Manager" },
      include: { users: { select: { id: true } } },
    });

    if (eventsManagerRole && eventsManagerRole.users.length > 0) {
      recipientId = eventsManagerRole.users[0].id; // Take the first user with this role
    } else {
      // Fallback: find any user with the ADMIN RoleName enum
      const adminUser = await prisma.user.findFirst({
        where: { roles: { has: "EVENTS_MANAGER" } },
        select: { id: true },
      });
      if (adminUser) {
        recipientId = adminUser.id;
      }
    }

    if (!recipientId) {
      console.error(
        "No Events Manager or Admin user found for sending message."
      );
      return NextResponse.json(
        { error: "No recipient found for message" },
        { status: 500 }
      );
    }

    // Create the in-app message record
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        recipientId: recipientId,
        eventId: event.id,
        subject: subject,
        content: message,
        type: MessageType.EVENT_QUERY, // Assign a specific message type
        read: false, // Mark as unread by default
      },
    });

    // --- Send Push Notification ---
    const pushSubscriptions = await prisma.pushSubscription.findMany({
      where: { userId: recipientId },
    });

    for (const pushSubscription of pushSubscriptions) {
      try {
        const payload = JSON.stringify({
          title: `New Message: ${subject}`,
          body: message,
          icon: "/icons/notification-icon.png", // Path to your notification icon
          url: "/events-manager/inbox", // URL to open when notification is clicked
        });

        await webpush.sendNotification(pushSubscription as any, payload);
      } catch (pushError: any) {
        console.error("Error sending push notification:", pushError);
        // If subscription is no longer valid, you might want to delete it from DB
        if (pushError.statusCode === 410) {
          // GONE status
          await prisma.pushSubscription.delete({
            where: { id: pushSubscription.id },
          });
          console.log("Deleted expired subscription:", pushSubscription.id);
        }
      }
    }

    return NextResponse.json(
      { message: "Message sent successfully", data: newMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message to admin:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
