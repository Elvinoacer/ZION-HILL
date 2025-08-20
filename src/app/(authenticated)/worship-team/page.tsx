"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const WorshipTeamPage = () => {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState([]);
  const [songProposals, setSongProposals] = useState([]);
  const [resources, setResources] = useState([]);
  const [worshipSets, setWorshipSets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [worshipMinistryId, setWorshipMinistryId] = useState<string | null>(
    null
  );
  const [worshipLeaderId, setWorshipLeaderId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ministriesRes = await fetch("/api/ministries");
        const ministriesData = await ministriesRes.json();
        const worshipMinistry = ministriesData.find(
          (m: any) => m.name === "Worship Ministry"
        );

        if (worshipMinistry) {
          setWorshipMinistryId(worshipMinistry.id);
          setWorshipLeaderId(worshipMinistry.leaderId);
        }

        let servicesApiUrl = `/api/services`;
        if (worshipMinistry) {
          servicesApiUrl += `?ministryId=${worshipMinistry.id}`;
        }

        const [
          announcementsRes,
          songProposalsRes,
          resourcesRes,
          worshipSetsRes,
          servicesRes,
        ] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/song-proposals"),
          fetch("/api/worship-resources"),
          fetch("/api/worship-sets"),
          fetch(servicesApiUrl),
        ]);

        const announcementsData = await announcementsRes.json();
        const songProposalsData = await songProposalsRes.json();
        const resourcesData = await resourcesRes.json();
        const worshipSetsData = await worshipSetsRes.json();
        const servicesData = await servicesRes.json();

        setAnnouncements(announcementsData);
        setSongProposals(songProposalsData);
        setResources(resourcesData);
        setWorshipSets(worshipSetsData);
        setServices(servicesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMessages = async () => {
    if (!worshipMinistryId) return;
    try {
      const res = await fetch(
        `/api/worship-messages?worshipMinistryId=${worshipMinistryId}`
      );
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    if (showChat) {
      fetchMessages();
    }
  }, [showChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !worshipLeaderId || !worshipMinistryId) return;

    try {
      const res = await fetch("/api/worship-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: worshipLeaderId,
          content: newMessage,
          worshipMinistryId,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-slate-800">
            Loading Worship Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Worship Team Dashboard
        </h1>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Worship Team Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Stay connected with your worship ministry
          </p>
        </div>
        {worshipLeaderId && (
          <Button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare size={18} />
            Contact Worship Leader
          </Button>
        )}
      </div>

      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  Chat with Worship Leader
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-blue-700"
                  onClick={() => setShowChat(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64 p-4">
                {messages.length > 0 ? (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${
                        msg.senderId === session?.user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          msg.senderId === session?.user?.id
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-slate-100 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === session?.user?.id
                              ? "text-blue-200"
                              : "text-slate-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <MessageSquare className="mx-auto mb-2" size={24} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </ScrollArea>
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 p-4 border-t"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send size={18} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-slate-100 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="songs" className="flex items-center gap-2">
            <Music size={16} />
            Songs
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Calendar size={16} />
            Services
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText size={16} />
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="flex items-center gap-2"
          >
            <Megaphone size={16} />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Overview */}
            <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-slate-800">
                  Ministry Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {services.length}
                    </div>
                    <div className="text-sm text-slate-600">
                      Upcoming Services
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {worshipSets.length}
                    </div>
                    <div className="text-sm text-slate-600">Worship Sets</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {songProposals.length}
                    </div>
                    <div className="text-sm text-slate-600">Song Proposals</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {resources.length}
                    </div>
                    <div className="text-sm text-slate-600">Resources</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Services Card */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 bg-slate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Calendar size={18} />
                  Upcoming Services
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.slice(0, 3).map((service: any) => (
                      <div
                        key={service.id}
                        className="pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-800">
                            {service.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            {new Date(service.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-slate-600">
                          <MapPin size={14} className="mr-1" />
                          {service.location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    No upcoming services
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Announcements Card */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 bg-slate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Megaphone size={18} />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.slice(0, 3).map((announcement: any) => (
                      <div
                        key={announcement.id}
                        className="pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <h3 className="font-semibold text-slate-800">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    No announcements
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Top Song Proposals Card */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 bg-slate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Music size={18} />
                  Popular Songs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {songProposals.length > 0 ? (
                  <div className="space-y-4">
                    {songProposals
                      .sort((a: any, b: any) => b.likes - a.likes)
                      .slice(0, 3)
                      .map((proposal: any) => (
                        <div
                          key={proposal.id}
                          className="pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-slate-800">
                              {proposal.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 bg-amber-50 text-amber-700"
                            >
                              <ThumbsUp size={12} />
                              {proposal.likes}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            by {proposal.user.name}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    No song proposals
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="songs">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="text-blue-600" />
                  Song Proposals
                </CardTitle>
                <CardDescription>
                  Browse and vote for songs you'd like to see in upcoming
                  worship sets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {songProposals.length > 0 ? (
                  <div className="divide-y">
                    {songProposals.map((proposal: any) => (
                      <div
                        key={proposal.id}
                        className="py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {proposal.title}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-slate-600">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage src={proposal.user.image} />
                                <AvatarFallback>
                                  {proposal.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              Proposed by {proposal.user.name}
                            </div>
                          </div>
                          <Badge className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            {proposal.likes}
                          </Badge>
                        </div>
                        {proposal.description && (
                          <p className="mt-2 text-slate-700">
                            {proposal.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Music size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No song proposals yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-blue-600" />
                  Upcoming Worship Sets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {worshipSets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {worshipSets.map((set: any) => (
                      <Card
                        key={set.id}
                        className="bg-slate-50 border-slate-200"
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{set.title}</CardTitle>
                          <div className="flex items-center text-sm text-slate-600">
                            <Calendar size={14} className="mr-1" />
                            {new Date(set.date).toLocaleDateString()}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-slate-700 mb-3">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={set.leader.image} />
                              <AvatarFallback>
                                {set.leader.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            Led by {set.leader.name}
                          </div>
                          {set.songs && set.songs.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-slate-800 mb-2">
                                Setlist:
                              </p>
                              <ul className="text-sm text-slate-700 space-y-1">
                                {set.songs.map((song: any, index: number) => (
                                  <li key={index} className="flex items-center">
                                    <span className="text-slate-400 mr-2">
                                      •
                                    </span>
                                    {song}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No worship sets scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-blue-600" />
                Service Schedule
              </CardTitle>
              <CardDescription>
                Upcoming services for the worship ministry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="divide-y">
                  {services.map((service: any) => (
                    <div key={service.id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {service.title}
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-slate-600">
                            <Calendar size={14} className="mr-1" />
                            {new Date(
                              service.date
                            ).toLocaleDateString()} at{" "}
                            {new Date(service.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center mt-1 text-sm text-slate-600">
                            <MapPin size={14} className="mr-1" />
                            {service.location}
                          </div>
                        </div>
                        <Badge className="md:self-start bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {service.type || "Regular Service"}
                        </Badge>
                      </div>
                      {service.description && (
                        <p className="mt-3 text-slate-700">
                          {service.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No services scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                Ministry Resources
              </CardTitle>
              <CardDescription>
                Helpful resources for worship team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource: any) => (
                    <Card
                      key={resource.id}
                      className="bg-slate-50 border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {resource.title}
                        </CardTitle>
                        <CardDescription>
                          {resource.type || "Resource"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-700 mb-3">
                          {resource.description || "No description available."}
                        </p>
                        <Button asChild variant="outline" className="w-full">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Resource
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No resources available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="text-blue-600" />
                Announcements
              </CardTitle>
              <CardDescription>
                Important updates from ministry leadership
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <div className="space-y-6">
                  {announcements.map((announcement: any) => (
                    <Card key={announcement.id} className="border-slate-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{announcement.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-700"
                          >
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 whitespace-pre-line">
                          {announcement.content}
                        </p>
                        {announcement.important && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                            <strong>Important Notice:</strong> This announcement
                            requires your attention.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No announcements at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorshipTeamPage;
