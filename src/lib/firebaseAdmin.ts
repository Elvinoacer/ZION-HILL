// src/lib/firebaseAdmin.ts
import admin from "firebase-admin";
import path from "path";

if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'church-web-app-43176-firebase-adminsdk-fbsvc-8699dc2bbd.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath), // Path to your service account key
  });
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