import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { content, senderId } = await req.json();

    // Save the message to the database
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        content: content,
        subject: "Community Message", // Default subject for community chat
        recipientId: null, // Set to null for community messages
      },
      include: { sender: true },
    });

    await pusherServer.trigger("chat-channel", "new-message", newMessage);

    // Trigger FCM notification
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fcm/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage, senderId }),
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
