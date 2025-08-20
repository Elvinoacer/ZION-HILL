const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const webpush = require("web-push");
const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// VAPID keys from .env
const publicVapidKey = process.env.WEB_PUSH_PUBLIC_KEY;
const privateVapidKey = process.env.WEB_PUSH_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:omondielvin@gmail.com", // Replace with your actual email
  publicVapidKey,
  privateVapidKey
);

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket.IO client connected");

    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await prisma.message.create({
          data: {
            senderId: data.senderId,
            content: data.content,
            subject: "Community Message", // Default subject for community chat
            recipientId: null, // Set to null for community messages
          },
          include: { sender: true },
        });
        io.emit("receiveMessage", newMessage);

        // Send push notifications
        const subscriptions = await prisma.pushSubscription.findMany();
        subscriptions.forEach((sub) => {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };
          const payload = JSON.stringify({
            title: `New Message from ${newMessage.sender.name}`,
            body: newMessage.content,
            icon: "/next.svg",
          });

          webpush.sendNotification(pushSubscription, payload).catch((err) => {
            console.error("Error sending push notification:", err);
            // Optionally, remove expired subscriptions from the database
            if (err.statusCode === 410) {
              // GONE status code
              prisma.pushSubscription
                .delete({ where: { id: sub.id } })
                .then(() => {
                  console.log("Removed expired subscription:", sub.id);
                });
            }
          });
        });
      } catch (error) {
        console.error("Error saving message or sending push:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO client disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
