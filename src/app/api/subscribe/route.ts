import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Assuming you have authOptions defined here

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { subscription, userId } = await req.json();

    if (!subscription || !userId) {
      return new NextResponse("Missing subscription or userId", {
        status: 400,
      });
    }

    if (userId !== session.user.id) {
      return new NextResponse("Forbidden: User ID mismatch", { status: 403 });
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    // Check if a subscription with this endpoint already exists for this user
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: {
        endpoint: endpoint,
      },
    });

    if (existingSubscription) {
      // If it exists and belongs to the same user, update it (or do nothing if it's identical)
      if (existingSubscription.userId === userId) {
        console.log(
          "Existing subscription found and is identical. No update needed."
        );
        return new NextResponse("Subscription already exists", { status: 200 });
      } else {
        // If the endpoint exists but belongs to a different user, it's an anomaly.
        // You might want to delete the old one and create a new one, or return an error.
        // For simplicity, let's update it to the new user.
        await prisma.pushSubscription.update({
          where: { endpoint: endpoint },
          data: { userId, p256dh, auth },
        });
        console.log("Updated existing subscription to new user.");
        return new NextResponse("Subscription updated", { status: 200 });
      }
    }

    // Create new subscription
    await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint,
        p256dh,
        auth,
      },
    });

    return new NextResponse("Subscription saved", { status: 200 });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
