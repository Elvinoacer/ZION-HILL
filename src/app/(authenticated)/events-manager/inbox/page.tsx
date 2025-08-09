"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Mail, MailOpen, AlertCircle, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  sender: { name: string; email: string };
  recipientId: string;
  eventId?: string;
  event?: { title: string };
  subject: string;
  content: string;
  read: boolean;
  type: "GENERAL" | "EVENT_QUERY" | "SUPPORT" | "FEEDBACK";
  createdAt: string;
}

const EventsManagerInboxPage = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      setError(null);
      return;
    }

    if (status === "unauthenticated") {
      setError("You must be logged in to view your inbox.");
      setLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      subscribeToPushNotifications();
    }

    if (!session?.user?.id) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await safeFetch<Message[]>(
          `/api/messages?recipientId=${session.user.id}`
        );
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(sortedData);
      } catch (err: any) {
        console.error("Failed to fetch messages:", err);
        setError(err.message);
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [status, session]);

  const subscribeToPushNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered:", registration);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission denied.");
        return;
      }

      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Existing push subscription found:", existingSubscription);
        await sendSubscriptionToServer(existingSubscription);
        return;
      }

      const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
      if (!VAPID_PUBLIC_KEY) {
        console.error("VAPID Public Key is not set.");
        toast.error("Push notification setup failed: Missing VAPID key.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log("New push subscription:", subscription);
      await sendSubscriptionToServer(subscription);
      toast.success("Subscribed to push notifications!");
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      toast.error("Failed to subscribe to push notifications.");
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      await safeFetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: session?.user?.id,
        }),
      });
      console.log("Push subscription sent to server.");
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
      toast.error("Failed to save push subscription.");
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await safeFetch(`/api/messages?id=${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
      );
      toast.success("Message marked as read.");
    } catch (err: any) {
      console.error("Failed to mark message as read:", err);
      toast.error(`Failed to mark as read: ${err.message}`);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await safeFetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success("Message deleted.");
    } catch (err: any) {
      console.error("Failed to delete message:", err);
      toast.error(`Failed to delete message: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-6" />
            <p className="text-xl text-gray-600 font-medium">
              Loading your inbox...
            </p>
            <p className="text-gray-500 mt-2">
              We're getting your messages ready
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-lg text-red-500 mb-6">{error}</p>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const unreadMessages = messages.filter((msg) => !msg.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Your Inbox
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your messages in one place
              </p>
            </div>
            {unreadMessages > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-md"
              >
                {unreadMessages} Unread Message{unreadMessages !== 1 ? "s" : ""}
              </motion.span>
            )}
          </div>

          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center py-12 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent>
                  <MailOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Your inbox is empty
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    When you receive messages, they'll appear here. Check back
                    later!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card
                      className={`border-0 shadow-sm transition-all duration-200 hover:shadow-md ${
                        !message.read
                          ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-white"
                          : "border-l-4 border-gray-200 bg-white"
                      }`}
                    >
                      <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
                        onClick={() =>
                          setSelectedMessage(
                            selectedMessage === message.id ? null : message.id
                          )
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-3 ${
                              !message.read ? "text-blue-500" : "text-gray-400"
                            }`}
                          >
                            {!message.read ? (
                              <Mail className="h-5 w-5" />
                            ) : (
                              <MailOpen className="h-5 w-5" />
                            )}
                          </div>
                          <CardTitle className="text-lg font-semibold">
                            {message.subject}
                            {!message.read && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </CardTitle>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(
                            new Date(message.createdAt),
                            "MMM d, yyyy · h:mm a"
                          )}
                        </div>
                      </CardHeader>
                      <CardContent
                        className={`${
                          selectedMessage === message.id
                            ? "block"
                            : "hidden sm:block"
                        }`}
                      >
                        <div className="pl-8">
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">From:</span>{" "}
                            {message.sender?.name ||
                              message.sender?.email ||
                              "Unknown Sender"}
                          </p>
                          {message.eventId && message.event?.title && (
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">
                                Regarding Event:
                              </span>{" "}
                              <Link
                                href={`/events/${message.eventId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {message.event.title}
                              </Link>
                            </p>
                          )}
                          <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-line">
                            {message.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {!message.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(message.id)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <MailOpen className="h-4 w-4 mr-2" /> Mark as
                                Read
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMessage(message.id)}
                              className="hover:bg-red-600/90"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventsManagerInboxPage;
