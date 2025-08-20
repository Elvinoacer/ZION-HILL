import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageType } from "@/generated/prisma";

export async function POST(request: Request) {
  try {
    const { senderId, recipientId, content } = await request.json();

    if (!senderId || !recipientId || !content) {
      return NextResponse.json({ error: "Sender ID, recipient ID, and content are required" }, { status: 400 });
    }

    const message = await prisma.worshipMessage.create({
      data: {
        senderId,
        recipientId,
        content,
        messageType: MessageType.PASTORAL_CARE,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending pastoral care message:", error);
    return NextResponse.json({ error: "Error sending message" }, { status: 500 });
  }
}
