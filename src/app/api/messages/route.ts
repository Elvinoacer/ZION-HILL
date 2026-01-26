import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { sendNotification } from "@/lib/notification-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("recipientId");
  const readStatus = searchParams.get("read"); // 'true' or 'false'

  try {
    const whereClause: any = {};

    if (recipientId) {
      whereClause.recipientId = recipientId;
    } else {
      // If no recipientId is provided, assume it's a request for community messages
      // where recipientId is null
      whereClause.recipientId = null;
    }

    if (readStatus !== null) {
      whereClause.read = readStatus === "true";
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { name: true, email: true, image: true } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { senderId, recipientId, subject, content, eventId, type } = body;

  console.log("Received message POST body:", body);

  if (!senderId || !content) {
    console.error(
      "Validation failed: Missing senderId or content."
    );
    return NextResponse.json(
      { error: "Sender and content are required" },
      { status: 400 }
    );
  }

  // Default values for community chat if not provided
  const finalSubject = subject || "Community Message";
  const finalRecipientId = recipientId || null;

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        recipientId: finalRecipientId,
        subject: finalSubject,
        content,
        eventId,
        type: type || "GENERAL",
      },
      include: { 
        sender: { select: { name: true, email: true, image: true } } 
      },
    });

    console.log("Message created successfully:", newMessage.id);

    // Trigger Pusher event
    // We use the same channel 'chat-channel' as the frontend expects
    await pusherServer.trigger("chat-channel", "new-message", newMessage);

    // Trigger FCM notification (Fire and forget, don't await blocking response)
    // Using relative URL or internal service would be better, but keeping consistent with previous logic for now
    // Trigger FCM notification (Fire and forget, don't await blocking response)
    if (recipientId) {
      sendNotification({
        userIds: [recipientId],
        title: `New Message from ${newMessage.sender.name || "a user"}`,
        body: content.length > 50 ? content.substring(0, 50) + "..." : content,
        data: {
          url: `/member/chat?senderId=${senderId}`,
          messageId: newMessage.id,
        },
        imageUrl: newMessage.sender.image || undefined,
      }).catch((err) => console.error("FCM Send Error:", err));
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Error creating message:", error.message);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid sender or recipient ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { read } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { read },
    });
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.message.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Error deleting message" },
      { status: 500 }
    );
  }
}
