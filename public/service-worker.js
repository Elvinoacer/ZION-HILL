self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title || "New Message";
  const options = {
    body: data.body || "You have a new message.",
    icon: data.icon || "/icons/notification-icon.png", // Default icon
    badge: data.badge || "/icons/notification-badge.png", // Optional badge
    data: {
      url: data.url || "/", // URL to open when notification is clicked
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(clients.openWindow(urlToOpen));
});

// Optional: Add a basic fetch handler if you want to cache assets
self.addEventListener("fetch", function (event) {
  // You can add caching strategies here if needed
});

/**
 * importScripts("https://js.pusher.com/beams/service-worker.js");
 */
