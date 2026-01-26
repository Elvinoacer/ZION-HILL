import { messaging } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

interface NotificationPayload {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export const sendNotification = async ({
  userIds,
  title,
  body,
  data,
  imageUrl,
}: NotificationPayload) => {
  if (!userIds.length) return;

  try {
    // 1. Fetch valid tokens for these users
    const tokensData = await prisma.fcmToken.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        token: true,
        userId: true,
      },
    });

    const tokens = tokensData.map((t) => t.token);

    if (!tokens.length) {
      console.log("No valid FCM tokens found for target users.");
      return;
    }

    // 2. Prepare the payload
    const message: any = {
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      data: data || {},
      tokens,
    };

    // 3. Send Multicast
    const response = await messaging.sendMulticast(message);

    // 4. Handle failures (cleanup invalid tokens)
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const error = resp.error;
          if (
            error?.code === "messaging/registration-token-not-registered" ||
            error?.code === "messaging/invalid-argument"
          ) {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {
        console.log(`Cleaning up ${failedTokens.length} invalid tokens...`);
        await prisma.fcmToken.deleteMany({
          where: {
            token: { in: failedTokens },
          },
        });
      }
    }

    console.log(`Notifications sent: ${response.successCount}/${tokens.length}`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};
