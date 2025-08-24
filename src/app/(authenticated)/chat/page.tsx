"use client";

import ChatMessage from "@/components/ChatMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";

interface Message {
  id: string;
  senderId: string;
  sender: { name: string; image?: string };
  content: string;
  imageUrl?: string;
  linkPreview?: any;
  createdAt: string;
}

const publicVapidKey =
  "BA5G7-42oUYg0AGcJ48b-S4TYEzCHqftMCwmwXinF-CUQHY11uGFZTwnNVy3EpMm4u6nsnyegwlmeGt8dIDrtkc";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(
    null
  );
  const [showGuidelines, setShowGuidelines] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [newMessage]);

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
    }, 500);

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

    const channel = pusherClient.subscribe("chat-channel");

    channel.bind("new-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (document.hidden && message.senderId !== session?.user?.id) {
        showNativeNotification(message);
      }
    });

    import { app, messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const token = await getToken(messaging, {
              vapidKey:
                process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (token) {
              await axios.post("/api/fcm/subscribe", {
                token,
                userId: session.user.id,
              });
            }
          }
        } catch (error) {
          console.error("Error getting permission or token", error);
        }
      };

      requestPermission();
    }
  }, [session]);

    return () => {
      pusherClient.unsubscribe("chat-channel");
    };
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showNativeNotification = (message: Message) => {
    if (Notification.permission === "granted") {
      new Notification(`New Message from ${message.sender.name}`, {
        body: message.content,
        icon: "/next.svg",
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
      let messageContent = newMessage;
      if (fileUrl) {
        messageContent = `${newMessage} ${fileUrl}`.trim();
      }

      await axios.post("/api/pusher", {
        content: messageContent,
        senderId: session.user.id,
      });

      setNewMessage("");
      setPreviewUrl(null);
      setLinkPreview(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
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
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Chat
          </h1>
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-blue-200"></div>
              <p className="text-gray-600 font-medium">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      {/* Header */}
      <header className="bg-white shadow-sm p-3 md:p-4 border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Chat
          </h1>
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuidelines(true)}
              className="hidden xs:inline-flex text-xs md:text-sm"
            >
              Guidelines
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowGuidelines(true)}
              className="xs:hidden h-8 w-8"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
            {totalMembers !== null && (
              <div className="text-xs md:text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                <span className="font-bold text-blue-600">{totalMembers}</span>{" "}
                Online
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-2 md:p-4">
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  onDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  Welcome to the Chat!
                </p>
                <p className="text-gray-500 mt-1 text-sm">
                  Be the first to start the conversation.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
            {(previewUrl || linkPreview) && (
              <div className="mb-3 p-2 border rounded-lg relative bg-white shadow-sm">
                <button
                  onClick={() => {
                    removePreview();
                    setLinkPreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                  aria-label="Remove preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 md:h-4 md:w-4"
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
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-32 rounded-md mx-auto"
                  />
                )}
                {linkPreview && (
                  <a
                    href={linkPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2"
                  >
                    {linkPreview.images && linkPreview.images.length > 0 && (
                      <img
                        src={linkPreview.images[0]}
                        alt={linkPreview.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {linkPreview.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {linkPreview.description}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="flex items-end space-x-2"
            >
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[44px] max-h-[120px] pr-10 resize-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={!session?.user?.id}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e as any);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2 h-7 w-7 text-gray-500 hover:text-blue-600"
                  disabled={!session?.user?.id}
                  onClick={() => fileInputRef.current?.click()}
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </Button>
                <Input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/*,application/pdf,.doc,.docx"
                />
              </div>
              <Button
                type="submit"
                disabled={
                  !session?.user?.id || (!newMessage.trim() && !previewUrl)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white h-[44px] px-3 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200"
                size="icon"
              >
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </form>
            {!session?.user?.id && (
              <div className="mt-2 flex items-center text-xs text-red-500">
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
        </div>
      </main>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="max-w-[95vw] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Guidelines Modal */}
      <AlertDialog open={showGuidelines} onOpenChange={setShowGuidelines}>
        <AlertDialogContent className="max-w-[95vw] rounded-xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Community Guidelines
            </AlertDialogTitle>
            <div className="text-muted-foreground text-sm">
              <ul className="list-disc list-inside text-gray-700 space-y-3 mt-4">
                <li>
                  <strong>Be Respectful:</strong> Treat all members with
                  kindness and respect, even when you disagree.
                </li>
                <li>
                  <strong>No Hate Speech:</strong> Harassment, discrimination,
                  and hate speech will not be tolerated.
                </li>
                <li>
                  <strong>Stay On Topic:</strong> Keep discussions relevant to
                  the community.
                </li>
                <li>
                  <strong>Protect Privacy:</strong> Do not share personal or
                  sensitive information.
                </li>
                <li>
                  <strong>No Spam:</strong> Commercial posts or unsolicited
                  promotions are not allowed.
                </li>
                <li>
                  <strong>Report Concerns:</strong> If you see inappropriate
                  behavior, please report it.
                </li>
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowGuidelines(false)}>
              Got it, thanks!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatPage;
