"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import io from "socket.io-client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"; // New import
import RichMessageContent from "@/components/RichMessageContent";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  id: string;
  senderId: string;
  sender: { name: string; image?: string }; // Added image property
  content: string;
  imageUrl?: string;
  linkPreview?: any;
  createdAt: string;
}

const socket = io(); // Connect to the Socket.IO server

const publicVapidKey =
  "BA5G7-42oUYg0AGcJ48b-S4TYEzCHqftMCwmwXinF-CUQHY11uGFZTwnNVy3EpMm4u6nsnyegwlmeGt8dIDrtkc"; // Replace with your actual public VAPID key

function urlBase64ToUint8Array(base64String: string) {
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
}

const ChatPage = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null); // New state

  useEffect(() => {
    const handler = setTimeout(() => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = newMessage.match(urlRegex);

      if (urls && urls.length > 0) {
        const fetchLinkPreview = async () => {
          try {
            const res = await fetch("/api/link-preview", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: urls[0] }),
            });
            const data = await res.json();
            setLinkPreview(data);
          } catch (error) {
            console.error("Failed to fetch link preview", error);
          }
        };
        fetchLinkPreview();
      } else {
        setLinkPreview(null);
      }
    }, 500); // Debounce by 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [newMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalMembers = async () => {
    try {
      const res = await fetch("/api/users/count");
      if (res.ok) {
        const data = await res.json();
        setTotalMembers(data.count);
      }
    } catch (err) {
      console.error("Failed to fetch total members:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchTotalMembers();

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      // Native browser notification (fallback if push not enabled/supported)
      if (document.hidden && message.senderId !== session?.user?.id) {
        showNativeNotification(message);
      }
    });

    // Register service worker and subscribe for push notifications
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker Registered", registration);
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          if (subscription) {
            console.log("Already subscribed", subscription);
            // You might want to send this subscription to your backend if it's not already there
          } else {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                navigator.serviceWorker.ready.then((registration) => {
                  registration.pushManager
                    .subscribe({
                      userVisibleOnly: true,
                      applicationServerKey:
                        urlBase64ToUint8Array(publicVapidKey),
                    })
                    .then((newSubscription) => {
                      console.log("New Push Subscription", newSubscription);
                      // Send subscription to your backend
                      if (session?.user?.id) {
                        fetch("/api/subscribe", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            endpoint: newSubscription.endpoint,
                            expirationTime: newSubscription.expirationTime,
                            keys: newSubscription.toJSON().keys,
                            userId: session.user.id,
                          }),
                        });
                      }
                    })
                    .catch((e) => {
                      console.error("Failed to subscribe the user: ", e);
                    });
                });
              } else {
                console.warn("Notification permission denied.");
              }
            });
          }
        })
        .catch((e) => {
          console.error("Service Worker Error", e);
        });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showNativeNotification = (message: Message) => {
    if (Notification.permission === "granted") {
      new Notification(`New Message from ${message.sender.name}`, {
        body: message.content,
        icon: "/next.svg", // Replace with your church logo or a chat icon
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim() && !previewUrl) return;

    let fileUrl = "";

    if (previewUrl) {
      const file = fileInputRef.current?.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          let uploadResponse;
          if (file.type.startsWith("image/")) {
            uploadResponse = await fetch("/api/upload-image", {
              method: "POST",
              body: formData,
            });
          } else {
            uploadResponse = await fetch(
              `/api/upload-document?filename=${file.name}`,
              {
                method: "POST",
                body: file,
              }
            );
          }

          const uploadData = await uploadResponse.json();
          if (uploadData.url) {
            fileUrl = uploadData.url;
          } else {
            throw new Error("Failed to upload file");
          }
        } catch (err: any) {
          setError(err.message);
          return;
        }
      }
    }

    try {
      // Emit message via Socket.IO
      let messageContent = newMessage;
      if (fileUrl) {
        messageContent = `${newMessage} ${fileUrl}`.trim();
      }

      socket.emit("sendMessage", {
        senderId: session.user.id,
        content: messageContent,
        imageUrl: null, // Set imageUrl to null as it's now in content
        linkPreview: linkPreview,
      });

      setNewMessage("");
      setPreviewUrl(null); // Clear previewUrl after sending
      setLinkPreview(null); // Clear link preview after sending
      // No need to fetch messages here, as socket.on('receiveMessage') will update state
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDeleteId(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDeleteId) return;

    try {
      const res = await fetch(`/api/messages/${messageToDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete message");
      }

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToDeleteId)
      );
      setMessageToDeleteId(null);
      setShowDeleteConfirm(false);
    } catch (err: any) {
      console.error("Error deleting message:", err);
      setError(err.message);
      setShowDeleteConfirm(false); // Close modal even on error
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Community Chat
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-200"></div>
            <p className="text-lg text-gray-600 font-medium">
              Loading messages...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Community Chat
        </h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl px-4">
      <div className="flex flex-col space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Community Chat
        </h1>

        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Community Guidelines
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Be respectful and kind to all members.</li>
            <li>No hate speech, discrimination, or harassment.</li>
            <li>Keep discussions constructive and positive.</li>
            <li>Protect your personal information.</li>
            <li>Report any inappropriate behavior to moderators.</li>
          </ul>
          {totalMembers !== null && (
            <p className="mt-4 text-lg font-medium text-gray-700">
              Total Members:{" "}
              <span className="text-blue-600">{totalMembers}</span>
            </p>
          )}
        </div>

        <Card className="h-[600px] flex flex-col shadow-xl border border-gray-200 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <CardTitle className="text-white flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Live Chat</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} onDelete={handleDeleteMessage} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-gray-500 text-lg font-medium">
                  No messages yet
                </p>
                <p className="text-gray-400 mt-1">
                  Be the first to start the conversation!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t bg-white">
            {/* Preview section above the input */}
            {(previewUrl || linkPreview) && (
              <div className="mb-3 relative">
                {previewUrl && (
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 rounded-md border border-gray-200"
                    />
                    <button
                      onClick={removePreview}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {linkPreview && (
                  <div className="border rounded-md p-2 relative">
                    <button
                      onClick={() => setLinkPreview(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <a
                      href={linkPreview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="font-bold">{linkPreview.title}</p>
                      <p>{linkPreview.description}</p>
                      {linkPreview.images && linkPreview.images.length > 0 && (
                        <img
                          src={linkPreview.images[0]}
                          alt={linkPreview.title}
                          className="max-w-xs rounded-md"
                        />
                      )}
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={!session?.user?.id}
                rows={1}
              />
              <Input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept="image/*"
              />
              <label htmlFor="file-input">
                <Button type="button" asChild>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </span>
                </Button>
              </label>
              <Button
                type="submit"
                disabled={!session?.user?.id}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </Button>
            </form>
            {!session?.user?.id && (
              <div className="mt-2 flex items-center text-sm text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                You must be logged in to send messages.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatPage;
