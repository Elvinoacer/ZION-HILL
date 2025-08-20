import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { comment, imageUrl, sentiment, userId, tags } = body;

    if (!comment || !userId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        comment,
        imageUrl,
        sentiment,
        userId,
        tags,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}