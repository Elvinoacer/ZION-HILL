import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  console.log("Received message POST body:", body); // Added logging

  if (!senderId || !recipientId || !subject || !content) {
    console.error(
      "Validation failed: Missing required fields for message creation."
    ); // Added logging
    return NextResponse.json(
      { error: "Sender, recipient, subject, and content are required" },
      { status: 400 }
    );
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        subject,
        content,
        eventId,
        type,
      },
    });
    console.log("Message created successfully:", newMessage); // Added logging
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    // Explicitly type error as any for easier access to message
    console.error("Error creating message:", error.message); // Log error message
    // Check for specific Prisma errors if needed
    if (error.code === "P2003") {
      // Foreign key constraint failed
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
