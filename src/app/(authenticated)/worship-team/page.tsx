"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Music,
  Calendar,
  Megaphone,
  FileText,
  Users,
  X,
  Send,
  ThumbsUp,
  MapPin,
  Loader2,
  Info,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ... (keep all interface definitions as they are)

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-10" />
            <Skeleton className="h-10 w-full rounded-lg mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl lg:col-span-1 md:col-span-2" />
            </div>
        </div>
    </div>
);

const WorshipTeamPage = () => {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState([]);
  const [songProposals, setSongProposals] = useState([]);
  const [resources, setResources] = useState([]);
  const [worshipSets, setWorshipSets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [worshipMinistryId, setWorshipMinistryId] = useState<string | null>(null);
  const [worshipLeaderId, setWorshipLeaderId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const ministriesRes = await fetch("/api/ministries");
      const ministriesData = await ministriesRes.json();
      const worshipMinistry = ministriesData.find((m: any) => m.name === "Worship Ministry");

      if (worshipMinistry) {
        setWorshipMinistryId(worshipMinistry.id);
        setWorshipLeaderId(worshipMinistry.leaderId);
      }

      const [announcementsRes, songProposalsRes, resourcesRes, worshipSetsRes, servicesRes] = await Promise.all([
        fetch("/api/announcements"),
        fetch("/api/song-proposals"),
        fetch("/api/worship-resources"),
        fetch("/api/worship-sets"),
        fetch(worshipMinistry ? `/api/services?ministryId=${worshipMinistry.id}` : "/api/services"),
      ]);

      setAnnouncements(await announcementsRes.json());
      setSongProposals(await songProposalsRes.json());
      setResources(await resourcesRes.json());
      setWorshipSets(await worshipSetsRes.json());
      setServices(await servicesRes.json());

    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchMessages = useCallback(async () => {
    if (!worshipMinistryId) return;
    try {
      const res = await fetch(`/api/worship-messages?worshipMinistryId=${worshipMinistryId}`);
      setMessages(await res.json());
    } catch (error) {
      toast.error("Failed to fetch messages");
    }
  }, [worshipMinistryId]);

  useEffect(() => {
    if (showChat) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [showChat, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !worshipLeaderId || !worshipMinistryId || !session?.user?.id) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/worship-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: worshipLeaderId, content: newMessage, worshipMinistryId }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
        setIsSending(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    Worship Team Hub
                </h1>
                <p className="mt-2 max-w-3xl text-lg text-gray-500 dark:text-gray-400">
                    Your central place for schedules, resources, and team communication.
                </p>
            </div>
            {worshipLeaderId && (
                <Button onClick={() => setShowChat(true)} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <MessageSquare size={18} />
                    Contact Leader
                </Button>
            )}
        </motion.div>

        {/* Chat Modal */}
        <AnimatePresence>
            {showChat && <ChatModal {...{ setShowChat, messages, newMessage, setNewMessage, handleSendMessage, isSending, session, worshipLeaderId }} />}
        </AnimatePresence>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-xl h-auto">
            <TabsTrigger value="overview"><Users className="h-4 w-4 mr-2"/>Overview</TabsTrigger>
            <TabsTrigger value="songs"><Music className="h-4 w-4 mr-2"/>Songs</TabsTrigger>
            <TabsTrigger value="services"><Calendar className="h-4 w-4 mr-2"/>Services</TabsTrigger>
            <TabsTrigger value="resources"><FileText className="h-4 w-4 mr-2"/>Resources</TabsTrigger>
            <TabsTrigger value="announcements"><Megaphone className="h-4 w-4 mr-2"/>Announcements</TabsTrigger>
          </TabsList>

          {/* All TabsContent will be wrapped for consistent animation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TabsContent value="overview" className="space-y-8">
                <OverviewTabContent {...{ services, worshipSets, songProposals, resources, announcements }} />
            </TabsContent>
            <TabsContent value="songs" className="space-y-8">
                <SongsTabContent {...{ songProposals, worshipSets }} />
            </TabsContent>
            <TabsContent value="services">
                <ServicesTabContent {...{ services }} />
            </TabsContent>
            <TabsContent value="resources">
                <ResourcesTabContent {...{ resources }} />
            </TabsContent>
            <TabsContent value="announcements">
                <AnnouncementsTabContent {...{ announcements }} />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

// Breaking down into smaller components for readability and maintainability

const ChatModal = ({ setShowChat, messages, newMessage, setNewMessage, handleSendMessage, isSending, session, worshipLeaderId }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg">
            <Card className="w-full shadow-2xl rounded-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-700/60">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold"><MessageSquare className="h-5 w-5 text-pink-500"/>Chat with Leader</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowChat(false)}><X size={18} /></Button>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-80 p-4">
                        {messages.length > 0 ? messages.map((msg: any) => (
                            <div key={msg.id} className={`flex my-2 ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs rounded-2xl px-4 py-2 ${msg.senderId === session?.user?.id ? "bg-pink-500 text-white rounded-br-none" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"}`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-xs mt-1 opacity-70`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        )) : <div className="text-center text-gray-500 py-12">No messages yet.</div>}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t dark:border-gray-700/60">
                    <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-pink-500" />
                        <Button type="submit" size="icon" className="bg-pink-500 hover:bg-pink-600 text-white" disabled={isSending}>{isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send size={18} />}</Button>
                    </form>
                </CardFooter>
            </Card>
        </motion.div>
    </motion.div>
);

const OverviewTabContent = ({ services, worshipSets, songProposals, resources, announcements }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ... content for overview tab ... */}
    </div>
);

const SongsTabContent = ({ songProposals, worshipSets }: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ... content for songs tab ... */}
    </div>
);

const ServicesTabContent = ({ services }: any) => (
    <Card className="shadow-lg rounded-2xl">{/* ... content for services tab ... */}</Card>
);

const ResourcesTabContent = ({ resources }: any) => (
    <Card className="shadow-lg rounded-2xl">{/* ... content for resources tab ... */}</Card>
);

const AnnouncementsTabContent = ({ announcements }: any) => (
    <Card className="shadow-lg rounded-2xl">{/* ... content for announcements tab ... */}</Card>
);

export default WorshipTeamPage;
