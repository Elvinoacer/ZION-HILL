"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Send,
  Flame,
  MessageSquarePlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-400/50",
    label: "Pending",
  },
  ONGOING: {
    icon: Loader2,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-400/50",
    label: "In Progress",
  },
  PRAYED: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-400/50",
    label: "Prayed For",
  },
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-12 w-1/2 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-10" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const PrayerRequestCard = ({ request, onJoinRoom, isJoining }: { request: PrayerRequest, onJoinRoom: (id: string) => void, isJoining: boolean }) => {
    const StatusIcon = statusConfig[request.status].icon;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
        >
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {request.user?.image ? (
                            <Image src={request.user.image} alt={request.user.name || 'User'} width={48} height={48} className="rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-3 sm:mb-0">
                                {request.request}
                            </p>
                            {request.isUrgent && (
                                <Badge variant="destructive" className="flex-shrink-0 flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs sm:ml-4">
                                    <Flame className="h-3.5 w-3.5" /> URGENT
                                </Badge>
                            )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Badge className={`${statusConfig[request.status].color} border text-xs font-medium py-1 px-2.5 rounded-full flex items-center gap-1.5`}>
                                    <StatusIcon className={`h-3.5 w-3.5 ${request.status === 'ONGOING' ? 'animate-spin' : ''}`} />
                                    {statusConfig[request.status].label}
                                </Badge>
                                <span className="text-xs">{new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="font-medium text-gray-600 dark:text-gray-300">
                                By: {request.user?.name || 'Anonymous'}
                            </div>
                        </div>
                    </div>
                </div>
                {request.status === "ONGOING" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60">
                        <Button onClick={() => onJoinRoom(request.id)} disabled={isJoining} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                            {isJoining ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining...</> : <><Mic className="h-4 w-4" /> Join Live Prayer</>}
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const PrayerWallPage = () => {
  const { data: session, status } = useSession();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newPrayerRequest, setNewPrayerRequest] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState<string | null>(null);

  const fetchPrayerRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch<PrayerRequest[]>("/api/prayer-wall");
      setPrayerRequests(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError("Failed to load prayer requests. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== 'loading') {
        fetchPrayerRequests();
    }
  }, [status, fetchPrayerRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerRequest.trim() || !session?.user?.id) {
      setError("Prayer request cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await safeFetch("/api/prayer-wall", {
        method: "POST",
        body: JSON.stringify({ request: newPrayerRequest, isUrgent, isPublic: true, userId: session.user.id }),
      });
      setNewPrayerRequest("");
      setIsUrgent(false);
      await fetchPrayerRequests(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to submit your prayer request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinAudioRoom = async (prayerRequestId: string) => {
    setIsJoiningRoom(prayerRequestId);
    setError(null);
    try {
      const data = await safeFetch<{ url: string }>(`/api/daily-rooms`, {
          method: "POST",
          body: JSON.stringify({ prayerRequestId })
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve the prayer room URL.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to create or join the prayer room.");
      setIsJoiningRoom(null);
    }
  };

  if (status === 'loading' || loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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
                  The Prayer Wall
                </h1>
                <p className="text-lg text-white/90">
                  A sacred space to share burdens, celebrate blessings, and stand together in faith.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div layout className="mb-8">
          <Card className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start gap-4">
                    <Image src={session?.user?.image || '/images/default-avatar.png'} alt="Your avatar" width={40} height={40} className="rounded-full mt-1" />
                    <Textarea
                        id="prayerRequest"
                        value={newPrayerRequest}
                        onChange={(e) => setNewPrayerRequest(e.target.value)}
                        required
                        rows={3}
                        disabled={!session?.user?.id || isSubmitting}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-purple-500 rounded-xl p-4 transition"
                        placeholder={session?.user?.id ? "Share what's on your heart..." : "Please log in to post a prayer."}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pl-14">
                  <div className="flex items-center gap-3">
                    <Switch id="isUrgent" checked={isUrgent} onCheckedChange={setIsUrgent} disabled={!session?.user?.id || isSubmitting} />
                    <label htmlFor="isUrgent" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <Flame className="h-4 w-4 text-red-500"/> Mark as Urgent
                    </label>
                  </div>
                  <Button type="submit" disabled={!session?.user?.id || isSubmitting} className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</> : <><Send className="h-4 w-4" /> Post Prayer</>}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
            <AnimatePresence>
                {prayerRequests.length > 0 ? (
                    prayerRequests.map((request) => (
                        <PrayerRequestCard key={request.id} request={request} onJoinRoom={handleJoinAudioRoom} isJoining={isJoiningRoom === request.id} />
                    ))
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm">
                        <Users className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">The Wall is Quiet</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Be the first to add a prayer and start the chain of support.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {error && !loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed bottom-5 right-5">
                <Card className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
                </Card>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default PrayerWallPage;
