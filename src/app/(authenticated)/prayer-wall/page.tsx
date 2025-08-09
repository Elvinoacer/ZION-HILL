"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Mic,
  User,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface PrayerRequest {
  id: string;
  request: string;
  isUrgent: boolean;
  isPublic: boolean;
  userId?: string;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  status: "ONGOING" | "PENDING" | "PRAYED";
  dailyRoomUrl?: string;
  dailyRoomName?: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ONGOING: "bg-blue-100 text-blue-800",
  PRAYED: "bg-green-100 text-green-800",
};

const PrayerWallPage = () => {
  const { data: session } = useSession();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newPrayerRequest, setNewPrayerRequest] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const fetchPrayerRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch<PrayerRequest[]>("/api/prayer-wall");
      setPrayerRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPrayerRequest.trim() || !session?.user?.id) {
      setError("Please enter a prayer request and ensure you are logged in.");
      return;
    }

    try {
      await safeFetch("/api/prayer-wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: newPrayerRequest,
          isUrgent,
          isPublic: true,
          userId: session.user.id,
        }),
      });

      setNewPrayerRequest("");
      setIsUrgent(false);
      fetchPrayerRequests();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoinAudioRoom = async (prayerRequestId: string) => {
    setIsJoiningRoom(true);
    setError(null);
    try {
      const response = await fetch("/api/daily-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prayerRequestId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create prayer room");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setIsJoiningRoom(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Prayer Wall Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src="https://i.pinimg.com/736x/f2/4f/14/f24f14e5a83a25309ffe864044ea8416.jpg"
              alt="Prayer Wall Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Prayer Wall
                </h1>
                <p className="text-lg text-white/90">
                  Share your prayer needs and lift others up in prayer
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Prayer Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="flex items-center">
                <Heart className="h-6 w-6 mr-2" />
                Submit a Prayer Request
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="prayerRequest"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Prayer Request
                  </label>
                  <Textarea
                    id="prayerRequest"
                    value={newPrayerRequest}
                    onChange={(e) => setNewPrayerRequest(e.target.value)}
                    required
                    rows={4}
                    disabled={!session?.user?.id}
                    className="min-h-[120px]"
                    placeholder="Share your prayer need with the community..."
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    disabled={!session?.user?.id}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isUrgent"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as Urgent
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex items-center space-x-4">
                  <Button
                    type="submit"
                    disabled={!session?.user?.id}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Submit Request
                  </Button>
                  {!session?.user?.id && (
                    <p className="text-sm text-red-500">
                      You must be logged in to submit prayer requests.
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Prayer Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="flex items-center">
                <Bell className="h-6 w-6 mr-2" />
                Community Prayer Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {prayerRequests.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {prayerRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className="border border-gray-100 p-5 rounded-lg shadow-sm bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-shrink-0">
                            {request.user?.image ? (
                              <img
                                src={request.user.image}
                                alt={request.user.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {request.request}
                                </h3>
                                {request.user && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Submitted by{" "}
                                    {request.user.name || request.user.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                {request.isUrgent && (
                                  <Badge variant="destructive">URGENT</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center mt-2 space-x-4">
                              <Badge className={statusColors[request.status]}>
                                {request.status === "PENDING" && (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {request.status === "ONGOING" && (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                )}
                                {request.status === "PRAYED" && (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                {request.status}
                              </Badge>
                              <p className="text-xs text-gray-400">
                                {new Date(request.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {request.status === "ONGOING" && (
                          <div className="mt-4">
                            <Button
                                onClick={() => handleJoinAudioRoom(request)}
                                disabled={isJoiningRoom}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto"
                              >
                              {isJoiningRoom ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Joining Prayer Room...
                                </>
                              ) : (
                                <>
                                  <Mic className="h-4 w-4 mr-2" />
                                  Join Prayer Room
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <Bell className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No prayer requests yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to share a prayer request with the community.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PrayerWallPage;
