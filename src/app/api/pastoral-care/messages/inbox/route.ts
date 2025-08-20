import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageType } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const messages = await prisma.worshipMessage.findMany({
      where: {
        messageType: MessageType.PASTORAL_CARE,
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching pastoral care messages:", error);
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
}
