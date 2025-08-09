import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // const newSubscription = await prisma.user.create({ data: { email, name: 'Newsletter Subscriber' } }); // Assuming a simplified User model for newsletter subscribers
    const existingSubscription = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existingSubscription) {
      return NextResponse.json(
        {
          subscriber: existingSubscription,
          status: "existing",
          message:
            "Thank you for confirming!, you already exist in the database",
        },
        { status: 201 }
      );
    }
    const newSubscription = await prisma.newsletterSubscriber.create({
      data: { email },
    });
    return NextResponse.json(
      {
        subscriber: newSubscription,
        status: "new",
        message: "Thank you for subscribing to our newsletter!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error subscribing to newsletter" },
      { status: 500 }
    );
  }
}
