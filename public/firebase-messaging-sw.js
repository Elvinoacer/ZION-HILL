// src/app/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCRO0syVY11KEa6VLP-YaHP0daxFNnGxVE",
  authDomain: "the-grok-ntf.firebaseapp.com",
  projectId: "the-grok-ntf",
  storageBucket: "the-grok-ntf.firebasestorage.app",
  messagingSenderId: "590787118981",
  appId: "1:590787118981:web:020c1b66f86adf998fe6ec",
  measurementId: "G-YY1YGQHKX9",
});

const messaging = firebase.messaging();