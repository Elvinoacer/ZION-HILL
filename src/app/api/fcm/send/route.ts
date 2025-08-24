import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { prisma } from "@/lib/prisma";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req: Request) {
  try {
    const { message, senderId } = await req.json();

    if (!message || !senderId) {
      return new NextResponse("Missing message or senderId", { status: 400 });
    }

    // Get all FCM tokens from the database
    const fcmTokens = await prisma.fcmToken.findMany();

    if (fcmTokens.length === 0) {
      return new NextResponse("No devices are subscribed for notifications", {
        status: 200,
      });
    }

    const tokens = fcmTokens.map((token) => token.token);

    const payload = {
      notification: {
        title: `New message from ${message.sender.name}`,
        body: message.content,
        icon: message.sender.image || "/next.svg",
      },
      webpush: {
        fcm_options: {
          link: `https://church-web-v2.vercel.app/chat`,
        },
      },
    };

    // Send notifications to all tokens
    const response = await admin.messaging().sendToDevice(tokens, payload);

    // You can handle the response here, e.g., to remove invalid tokens

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error sending FCM message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
