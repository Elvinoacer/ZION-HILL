"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import {
  Mail,
  MailOpen,
  AlertCircle,
  Loader2,
  Trash2,
  Filter,
  Search,
  Bell,
  BellOff,
  User,
  Calendar,
  FileText,
  Reply,
  Archive,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
      checkNotificationPermission();
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
        setFilteredMessages(sortedData);
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

  // Filter messages based on search term and filters
  useEffect(() => {
    let result = messages;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (message) =>
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.sender?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          message.sender?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((message) => message.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((message) =>
        statusFilter === "unread" ? !message.read : message.read
      );
    }

    setFilteredMessages(result);
  }, [searchTerm, typeFilter, statusFilter, messages]);

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === "granted");
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error(
        "Notifications are blocked. Please enable them in your browser settings."
      );
      return;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        toast.success("Notifications enabled!");
      }
      return;
    }

    // If already granted, we can't revoke programmatically
    // User must change in browser settings
    toast.info(
      "To disable notifications, please change your browser settings."
    );
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

  const handleMarkAllAsRead = async () => {
    try {
      await safeFetch(
        `/api/messages/mark-all-read?recipientId=${session?.user?.id}`,
        {
          method: "PUT",
        }
      );
      setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
      toast.success("All messages marked as read.");
    } catch (err: any) {
      console.error("Failed to mark all messages as read:", err);
      toast.error(`Failed to mark all as read: ${err.message}`);
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

  const handleArchiveMessage = async (messageId: string) => {
    try {
      // This would require adding an 'archived' field to your Message model
      await safeFetch(`/api/messages?id=${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success("Message archived.");
    } catch (err: any) {
      console.error("Failed to archive message:", err);
      toast.error(`Failed to archive message: ${err.message}`);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "EVENT_QUERY":
        return <Calendar className="h-4 w-4" />;
      case "SUPPORT":
        return <FileText className="h-4 w-4" />;
      case "FEEDBACK":
        return <User className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "EVENT_QUERY":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "SUPPORT":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "FEEDBACK":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading your inbox...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700/60">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Inbox
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const unreadMessages = messages.filter((msg) => !msg.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Message Inbox
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage all your event-related communications
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={toggleNotifications}
                className="flex items-center"
              >
                {notificationsEnabled ? (
                  <>
                    <Bell className="h-4 w-4 mr-2 text-green-600" />
                    Notifications On
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4 mr-2 text-gray-500" />
                    Enable Notifications
                  </>
                )}
              </Button>

              {unreadMessages > 0 && (
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  {unreadMessages} Unread
                </Badge>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Message Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="EVENT_QUERY">Event Queries</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="FEEDBACK">Feedback</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          {messages.length > 0 && unreadMessages > 0 && (
            <div className="flex justify-end mb-6">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="flex items-center"
              >
                <MailOpen className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          )}

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center py-12 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent>
                  <MailOpen className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {searchTerm ||
                    typeFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No messages match your search"
                      : "Your inbox is empty"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm ||
                    typeFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "When you receive messages, they'll appear here. Check back later!"}
                  </p>
                  {(searchTerm ||
                    typeFilter !== "all" ||
                    statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setTypeFilter("all");
                        setStatusFilter("all");
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredMessages.map((message) => (
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
                          ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/20 dark:to-gray-800"
                          : "border-l-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
                        <div className="flex items-center gap-3">
                          <div
                            className={`${
                              !message.read
                                ? "text-blue-500"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {!message.read ? (
                              <Mail className="h-5 w-5" />
                            ) : (
                              <MailOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                              {message.subject}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={getMessageTypeColor(message.type)}
                              >
                                <span className="flex items-center gap-1">
                                  {getMessageTypeIcon(message.type)}
                                  {message.type.replace("_", " ")}
                                </span>
                              </Badge>
                              {!message.read && (
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(
                            parseISO(message.createdAt),
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
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            <span className="font-medium">From:</span>{" "}
                            {message.sender?.name ||
                              message.sender?.email ||
                              "Unknown Sender"}
                          </p>
                          {message.eventId && message.event?.title && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              <span className="font-medium">
                                Regarding Event:
                              </span>{" "}
                              <Link
                                href={`/events/${message.eventId}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {message.event.title}
                              </Link>
                            </p>
                          )}
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-line">
                            {message.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {!message.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(message.id)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              >
                                <MailOpen className="h-4 w-4 mr-2" /> Mark as
                                Read
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30"
                            >
                              <Reply className="h-4 w-4 mr-2" /> Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleArchiveMessage(message.id)}
                              className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <Archive className="h-4 w-4 mr-2" /> Archive
                            </Button>
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
