import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();
  console.log("Session:", session);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user || !user.id) { // Ensure user and user.id exist
    return NextResponse.json({ error: "Sender user not found or ID missing" }, { status: 404 });
  }

  const { recipientId, content, worshipMinistryId } = await request.json();

  if (!recipientId || !content || !worshipMinistryId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.worshipMessage.create({
      data: {
        senderId: user.id, // Use user.id directly, it's guaranteed to exist now
        recipientId,
        content,
        worshipMinistryId,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating worship message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const worshipMinistryId = searchParams.get("worshipMinistryId");

  if (!worshipMinistryId) {
    return NextResponse.json(
      { error: "Missing worshipMinistryId" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const messages = await prisma.worshipMessage.findMany({
      where: {
        worshipMinistryId,
        OR: [{ senderId: user.id }, { recipientId: user.id }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        recipient: { select: { id: true, name: true, image: true } },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching worship messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
