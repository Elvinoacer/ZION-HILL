import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyBfcjHJFCZLX0PISRpbyHFzAi-RkQHUbzE",
  authDomain: "church-web-app-43176.firebaseapp.com",
  projectId: "church-web-app-43176",
  storageBucket: "church-web-app-43176.firebasestorage.app",
  messagingSenderId: "628247436525",
  appId: "1:628247436525:web:08872611b2d91c533e00e4",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
