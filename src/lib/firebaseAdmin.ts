// src/lib/firebaseAdmin.ts
import admin from "firebase-admin";
import path from "path";

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}'
    );

    if (!serviceAccount.project_id) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing or invalid.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export const messaging = admin.messaging();

export const sendMulticastNotification = async (tokens: string[], title: string, body: string) => {
  if (tokens.length === 0) {
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent message:', response);
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('List of tokens that caused failures:', failedTokens);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};