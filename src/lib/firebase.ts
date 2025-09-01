// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCRO0syVY11KEa6VLP-YaHP0daxFNnGxVE",
  authDomain: "the-grok-ntf.firebaseapp.com",
  projectId: "the-grok-ntf",
  storageBucket: "the-grok-ntf.firebasestorage.app",
  messagingSenderId: "590787118981",
  appId: "1:590787118981:web:020c1b66f86adf998fe6ec",
  measurementId: "G-YY1YGQHKX9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const getFCMToken = async () => {
  if (!(await isSupported())) {
    console.log("FCM not supported in this browser");
    return null;
  }

  const messaging = getMessaging(app);
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BCgaCgoVeI-cmxp1KSeFz6aLhPhIGqsUPp7O30H9t4uc3XRCAYLR31PQBXg4th-aZMvilTa237SofxnFf4OPZHU",
    });
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
