// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const next = require("next");

// const webpush = require("web-push");
// const { PrismaClient } = require("./src/generated/prisma");
// const prisma = new PrismaClient();
// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
// const port = 3000;

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// // VAPID keys from .env
// const publicVapidKey = process.env.WEB_PUSH_PUBLIC_KEY;
// const privateVapidKey = process.env.WEB_PUSH_PRIVATE_KEY;

// webpush.setVapidDetails(
//   "mailto:omondielvin@gmail.com", // Replace with your actual email
//   publicVapidKey,
//   privateVapidKey
// );

// app.prepare().then(() => {
//   const httpServer = createServer(handle);
//   const io = new Server(httpServer);

//   io.on("connection", (socket) => {
//     console.log("Socket.IO client connected");

//     socket.on("sendMessage", async (data) => {
//       try {
//         const newMessage = await prisma.message.create({
//           data: {
//             senderId: data.senderId,
//             content: data.content,
//             subject: "Community Message", // Default subject for community chat
//             recipientId: null, // Set to null for community messages
//           },
//           include: { sender: true },
//         });
//         io.emit("receiveMessage", newMessage);

//         // Send push notifications
//         const subscriptions = await prisma.pushSubscription.findMany();
//         subscriptions.forEach((sub) => {
//           const pushSubscription = {
//             endpoint: sub.endpoint,
//             keys: {
//               p256dh: sub.p256dh,
//               auth: sub.auth,
//             },
//           };
//           const payload = JSON.stringify({
//             title: `New Message from ${newMessage.sender.name}`,
//             body: newMessage.content,
//             icon: "/next.svg",
//           });

//           webpush.sendNotification(pushSubscription, payload).catch((err) => {
//             console.error("Error sending push notification:", err);
//             // Optionally, remove expired subscriptions from the database
//             if (err.statusCode === 410) {
//               // GONE status code
//               prisma.pushSubscription
//                 .delete({ where: { id: sub.id } })
//                 .then(() => {
//                   console.log("Removed expired subscription:", sub.id);
//                 });
//             }
//           });
//         });
//       } catch (error) {
//         console.error("Error saving message or sending push:", error);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket.IO client disconnected");
//     });
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });

const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const webpush = require("web-push");
const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
// Get the correct URL based on environment
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

const app = next({ dev });
const handle = app.getRequestHandler();

// VAPID keys from environment variables
const publicVapidKey = process.env.WEB_PUSH_PUBLIC_KEY;
const privateVapidKey = process.env.WEB_PUSH_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:omondielvin@gmail.com",
  publicVapidKey,
  privateVapidKey
);

app.prepare().then(() => {
  const httpServer = createServer(handle);

  // Configure Socket.IO for production
  const io = new Server(httpServer, {
    cors: {
      origin: [
        baseUrl,
        "https://church-web-v2.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(
      "Socket.IO client connected from:",
      socket.handshake.headers.origin
    );

    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await prisma.message.create({
          data: {
            senderId: data.senderId,
            content: data.content,
            subject: "Community Message",
            recipientId: null,
          },
          include: { sender: true },
        });

        // Broadcast to all connected clients
        io.emit("receiveMessage", newMessage);

        // Send push notifications
        try {
          const subscriptions = await prisma.pushSubscription.findMany();
          const notificationPromises = subscriptions.map((sub) => {
            const pushSubscription = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            };

            const payload = JSON.stringify({
              title: `New Message from ${newMessage.sender.name}`,
              body:
                newMessage.content.length > 100
                  ? newMessage.content.substring(0, 100) + "..."
                  : newMessage.content,
              icon: `${baseUrl}/next.svg`,
              badge: `${baseUrl}/favicon.ico`,
              tag: "new-message",
              data: {
                url: `${baseUrl}/community`,
              },
            });

            return webpush
              .sendNotification(pushSubscription, payload)
              .catch((err) => {
                console.error("Error sending push notification:", err);
                // Remove expired subscriptions
                if (err.statusCode === 410) {
                  return prisma.pushSubscription
                    .delete({ where: { id: sub.id } })
                    .then(() =>
                      console.log("Removed expired subscription:", sub.id)
                    )
                    .catch((deleteErr) =>
                      console.error("Error deleting subscription:", deleteErr)
                    );
                }
                return Promise.resolve();
              });
          });

          await Promise.allSettled(notificationPromises);
        } catch (notificationError) {
          console.error("Error in notification process:", notificationError);
        }
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO client disconnected:", reason);
    });
  });

  // Handle server errors
  httpServer.on("error", (err) => {
    console.error("Server error:", err);
  });

  // Start server - different handling for Vercel vs local
  if (process.env.VERCEL) {
    // Export for Verc serverless functions
    module.exports = httpServer;
  } else {
    // Local development
    const port = process.env.PORT || 3000;
    httpServer.listen(port, () => {
      console.log(
        `> Ready on http://localhost:${port} in ${
          dev ? "development" : "production"
        } mode`
      );
    });
  }
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
