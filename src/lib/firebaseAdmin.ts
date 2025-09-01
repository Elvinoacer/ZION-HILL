// src/lib/firebaseAdmin.ts
import admin from "firebase-admin";
import path from "path";

if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'src', 'lib', 'the-grok-ntf-firebase-adminsdk-fbsvc-69f2552061.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath), // Path to your service account key
  });
}

export const messaging = admin.messaging();