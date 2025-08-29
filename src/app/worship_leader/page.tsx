"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  Layout,
  MapPin,
  MessageSquare,
  Music,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Import tab components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceDurationChart from "@/components/worship-leader/ServiceDurationChart";
import SongArrangement from "@/components/worship-leader/SongArrangement";
import SongProposals from "@/components/worship-leader/SongProposals";
import StreamManagement from "@/components/worship-leader/StreamManagement";
import TeamParticipationChart from "@/components/worship-leader/TeamParticipationChart";
import TopSongsChart from "@/components/worship-leader/TopSongsChart";
import WorshipResourceManagement from "@/components/worship-leader/WorshipResourceManagement";
import WorshipTeamManagement from "@/components/worship-leader/WorshipTeamManagement";
import AnnouncementBoard from "@/components/worship-leader/AnnouncementBoard";

interface Service {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
}

interface WorshipMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  recipientId: string;
  sender: { id: string; name: string | null; image: string | null };
  recipient: { id: string; name: string | null; image: string | null };
}

interface Participant {
  id: string;
  userId: string;
  status: string;
  user?: User;
}

interface WorshipSet {
  id: string;
  title: string;
  date: string;
  leaderId: string;
  arrangedSongs: Song[];
  leader?: { name: string; email: string };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  likes: number;
  createdAt: string;
  hasLiked?: boolean;
  likesByUsers?: { userId: string }[];
}

const WorshipLeaderDashboard = () => {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDate, setNewServiceDate] = useState("");
  const [newServiceLocation, setNewServiceLocation] = useState("");
  const [newServiceType, setNewServiceType] = useState("SERVICE");

  const [worshipMinistryId, setWorshipMinistryId] = useState<string | null>(null);
  const [currentMinistryMembers, setCurrentMinistryMembers] = useState<any[]>([]);

  const [worshipSets, setWorshipSets] = useState<WorshipSet[]>([]);
  const [selectedWorshipSet, setSelectedWorshipSet] = useState<WorshipSet | null>(null);
  const [newWorshipSetTitle, setNewWorshipSetTitle] = useState("");
  const [newWorshipSetDate, setNewWorshipSetDate] = useState("");
  const [showCreateWorshipSetForm, setShowCreateWorshipSetForm] = useState(false);
  const [showCreateMinistryForm, setShowCreateMinistryForm] = useState(false);
  const [newMinistryName, setNewMinistryName] = useState("Worship Ministry");
  const [newMinistryLeaderId, setNewMinistryLeaderId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatMember, setSelectedChatMember] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<WorshipMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [conversations, setConversations] = useState<User[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [serviceDurationData, setServiceDurationData] = useState<any[]>([]);
  const [teamParticipationData, setTeamParticipationData] = useState<any[]>([]);
  const [topSongsData, setTopSongsData] = useState<any[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const handleDeleteService = async (serviceId: string) => {
    setServiceToDeleteId(serviceId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDeleteId) return;

    const originalServices = [...services];
    setServices(services.filter((s) => s.id !== serviceToDeleteId));
    setShowDeleteConfirm(false);
    setServiceToDeleteId(null);
    setSelectedService(null);

    toast.loading("Deleting service...", { id: "delete-service" });

    try {
      const res = await fetch(`/api/services?id=${serviceToDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete service");
      }

      toast.success("Service deleted successfully!", { id: "delete-service" });
    } catch (err: any) {
      setServices(originalServices);
      toast.error(`Error deleting service: ${err.message}`, {
        id: "delete-service",
      });
      setError(err.message);
    }
  };

  const fetchServices = async () => {
    try {
      const servicesRes = await fetch("/api/services?type=SERVICE");
      if (!servicesRes.ok) throw new Error("Failed to fetch services");
      const servicesData = await servicesRes.json();
      setServices(servicesData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newServiceTitle,
          date: newServiceDate,
          location: newServiceLocation,
          type: newServiceType,
          worshipMinistryId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create service");
      }

      setShowServiceForm(false);
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/services?id=${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newServiceTitle,
          date: newServiceDate,
          location: newServiceLocation,
          type: newServiceType,
          ministryId: worshipMinistryId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update service");
      }

      setShowServiceForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorshipSets = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/worship-sets?leaderId=${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch worship sets");
      const data = await res.json();
      setWorshipSets(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateWorshipSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/worship-sets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newWorshipSetTitle,
          date: newWorshipSetDate,
          arrangedSongs: [],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create worship set");
      }

      setShowCreateWorshipSetForm(false);
      setNewWorshipSetTitle("");
      setNewWorshipSetDate("");
      fetchWorshipSets();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorshipMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newMinistryLeaderId) {
      setError("Please select a leader for the new ministry.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ministries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMinistryName,
          description: "",
          leaderId: newMinistryLeaderId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create ministry");
      }

      setShowCreateMinistryForm(false);
      const ministriesRes = await fetch("/api/ministries");
      const ministriesData = await ministriesRes.json();
      const worshipMinistry = ministriesData.find((m: any) => m.name === "Worship Ministry");
      if (worshipMinistry) {
        setWorshipMinistryId(worshipMinistry.id);
        fetchMinistryMembers(worshipMinistry.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongProposals = async () => {
    try {
      const res = await fetch("/api/song-proposals");
      if (!res.ok) throw new Error("Failed to fetch song proposals");
      const data = await res.json();
      setSongs(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const [serviceRes, teamRes, songsRes] = await Promise.all([
        fetch("/api/analytics/service-duration"),
        fetch("/api/analytics/team-participation"),
        fetch("/api/analytics/top-songs"),
      ]);

      if (!serviceRes.ok) throw new Error("Failed to fetch service duration data");
      if (!teamRes.ok) throw new Error("Failed to fetch team participation data");
      if (!songsRes.ok) throw new Error("Failed to fetch top songs data");

      const serviceData = await serviceRes.json();
      const teamData = await teamRes.json();
      const songsData = await songsRes.json();

      setServiceDurationData(serviceData);
      setTeamParticipationData(teamData);
      setTopSongsData(songsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchServices();
      if (session?.user?.id) {
        fetchWorshipSets();
        fetchSongProposals();
        fetchAnalyticsData();

        try {
          const ministriesRes = await fetch("/api/ministries");
          if (!ministriesRes.ok) throw new Error("Failed to fetch ministries");
          const ministriesData = await ministriesRes.json();

          const worshipMinistry = ministriesData.find((m: any) => m.name === "Worship Ministry");

          if (worshipMinistry) {
            setWorshipMinistryId(worshipMinistry.id);
            fetchMinistryMembers(worshipMinistry.id);
          } else {
            setShowCreateMinistryForm(true);
            const usersRes = await fetch("/api/users");
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            const usersData = await usersRes.json();
            setAllUsers(usersData);
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [session?.user?.id]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (selectedService?.id === service.id) {
      setSelectedService(null); // Deselect if clicking the same service
    } else {
      fetchParticipants(service.id);
    }
  };

  const handleAttendanceChange = async (participantId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/participants?id=${participantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update attendance");
      }

      setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status: newStatus } : p)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchParticipants = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/participants?serviceId=${serviceId}`);
      if (!res.ok) throw new Error("Failed to fetch participants");
      const data = await res.json();
      setParticipants(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleWorshipSetSelect = (worshipSetId: string) => {
    const selected = worshipSets.find((set) => set.id === worshipSetId);
    setSelectedWorshipSet(selected || null);
  };

  const fetchMinistryMembers = async (ministryId: string) => {
    try {
      const res = await fetch(`/api/ministry-members?ministryId=${ministryId}`);
      if (!res.ok) throw new Error("Failed to fetch ministry members");
      const data = await res.json();
      setCurrentMinistryMembers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMessageMember = (member: User) => {
    setSelectedChatMember(member);
    setShowChatModal(true);
  };

  const fetchChatMessages = async (memberId?: string) => {
    if (!worshipMinistryId || !session?.user?.id) return;
    try {
      const res = await fetch(`/api/worship-messages?worshipMinistryId=${worshipMinistryId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const allMessages: WorshipMessage[] = await res.json();

      const conversationsMap = new Map<string, WorshipMessage[]>();
      allMessages.forEach((msg) => {
        const otherParticipantId = msg.senderId === session.user.id ? msg.recipientId : msg.senderId;
        if (!conversationsMap.has(otherParticipantId)) {
          conversationsMap.set(otherParticipantId, []);
        }
        conversationsMap.get(otherParticipantId)?.push(msg);
      });

      const uniqueConversations: User[] = Array.from(conversationsMap.keys()).map((id) => {
        const messagesForUser = conversationsMap.get(id);
        const lastMessage = messagesForUser?.[messagesForUser.length - 1];
        return {
          id: id,
          name: lastMessage?.senderId === id ? lastMessage?.sender.name : lastMessage?.recipient.name,
          email: lastMessage?.senderId === id ? lastMessage?.sender.email : lastMessage?.recipient.email,
          image: lastMessage?.senderId === id ? lastMessage?.sender.image : lastMessage?.recipient.image,
        };
      });
      setConversations(uniqueConversations);

      // If no specific member is selected, automatically select the conversation with the latest message
      if (!memberId && uniqueConversations.length > 0) {
        // Find the message with the latest timestamp among all messages
        const latestMessage = allMessages.reduce((prev, current) => {
          return (new Date(prev.createdAt) > new Date(current.createdAt)) ? prev : current;
        });

        // Determine the other participant in the latest message
        const latestConversationMemberId = latestMessage.senderId === session.user.id
          ? latestMessage.recipientId
          : latestMessage.senderId;

        const latestConversationMember = uniqueConversations.find(
          (member) => member.id === latestConversationMemberId
        );

        if (latestConversationMember) {
          setSelectedChatMember(latestConversationMember);
          const filteredMessages = allMessages.filter(
            (msg) =>
              (msg.senderId === session.user.id && msg.recipientId === latestConversationMember.id) ||
              (msg.senderId === latestConversationMember.id && msg.recipientId === session.user.id)
          );
          setChatMessages(filteredMessages);
        } else {
          setChatMessages([]);
        }
      } else if (memberId) {
        const filteredMessages = allMessages.filter(
          (msg) =>
            (msg.senderId === session.user.id && msg.recipientId === memberId) ||
            (msg.senderId === memberId && msg.recipientId === session.user.id)
        );
        setChatMessages(filteredMessages);
      } else {
        setChatMessages([]);
      }
    } catch (err: any) {
      console.error("Error fetching chat messages:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (showChatModal) {
      console.log("Worship Leader Session User ID:", session?.user?.id);
      console.log("Worship Ministry ID:", worshipMinistryId);
      fetchChatMessages(selectedChatMember?.id);
    }
  }, [showChatModal, selectedChatMember]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedChatMember?.id || !worshipMinistryId) return;

    try {
      const res = await fetch("/api/worship-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedChatMember.id,
          content: newChatMessage,
          worshipMinistryId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setNewChatMessage("");
      fetchChatMessages(selectedChatMember.id);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || service.type === filterType;
    return matchesSearch && matchesType;
  });

  const AnalyticsDashboard = () => {
    const teamParticipationChartData = teamParticipationData.map((d, i) => ({
      ...d,
      color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][i % 4],
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 h-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Duration</h3>
          <ServiceDurationChart data={serviceDurationData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 h-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Participation</h3>
          <TeamParticipationChart data={teamParticipationChartData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 h-96 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Songs</h3>
          <TopSongsChart data={topSongsData} />
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Services</h2>
                <AnimatePresence>
                  {showServiceForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={editingService ? handleUpdateService : handleAddService}
                      className="space-y-3 mb-6 p-4 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <h3 className="font-medium text-gray-800">{editingService ? "Edit Service" : "New Service"}</h3>
                      <input
                        type="text"
                        value={newServiceTitle}
                        onChange={(e) => setNewServiceTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Title"
                        required
                      />
                      <input
                        type="datetime-local"
                        value={newServiceDate}
                        onChange={(e) => setNewServiceDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        value={newServiceLocation}
                        onChange={(e) => setNewServiceLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Location"
                      />
                      <select
                        value={newServiceType}
                        onChange={(e) => setNewServiceType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="SERVICE">Service</option>
                        <option value="MEETING">Meeting</option>
                        <option value="EVENT">Event</option>
                      </select>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                          {editingService ? "Update" : "Create"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowServiceForm(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>No services found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.01 }}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedService?.id === service.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-100 text-purple-700 p-2 rounded-md flex-shrink-0">
                                <Calendar size={16} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(service.date).toLocaleDateString()}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {new Date(service.date).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {service.location && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {service.location}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {service.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingService(service);
                                setNewServiceTitle(service.title);
                                setNewServiceDate(service.date.substring(0, 16));
                                setNewServiceLocation(service.location || "");
                                setNewServiceType(service.type);
                                setShowServiceForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleServiceSelect(service)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {selectedService?.id === service.id ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Attendance for {selectedService.title}</h3>
                    <button onClick={() => setSelectedService(null)} className="text-gray-500 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>
                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-400 text-white flex items-center justify-center">
                              {participant.user?.name?.charAt(0) || "P"}
                            </div>
                            <span>{participant.user?.name || `Participant ${participant.userId}`}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={participant.status === "Attended"}
                            onChange={(e) =>
                              handleAttendanceChange(participant.id, e.target.checked ? "Attended" : "Registered")
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No participants for this service.</p>
                  )}
                </motion.div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
                {currentMinistryMembers.length > 0 ? (
                  <div className="space-y-3">
                    {currentMinistryMembers.slice(0, 5).map((member) => (
                      <div key={member.user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-400 text-white flex items-center justify-center">
                            {member.user?.name?.charAt(0) || "M"}
                          </div>
                          <span className="font-medium text-sm">{member.user?.name}</span>
                        </div>
                        <button
                          onClick={() => handleMessageMember(member.user)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No team members</p>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                    <div className="text-sm text-blue-800">Services</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{currentMinistryMembers.length}</div>
                    <div className="text-sm text-green-800">Team Members</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{songs.length}</div>
                    <div className="text-sm text-purple-800">Songs</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{worshipSets.length}</div>
                    <div className="text-sm text-orange-800">Worship Sets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "team":
        return (
          <WorshipTeamManagement
            worshipMinistryId={worshipMinistryId}
            currentMinistryMembers={currentMinistryMembers}
            fetchMinistryMembers={fetchMinistryMembers}
            onMessageMember={handleMessageMember}
          />
        );
      case "resources":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Service for Resources</h3>
              <Select
                onValueChange={(serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  setSelectedService(service || null);
                }}
                value={selectedService?.id || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.length === 0 ? (
                    <SelectItem value="no-services" disabled>
                      No services available
                    </SelectItem>
                  ) : (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title} - {new Date(service.date).toLocaleDateString()}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedService && (
                <p className="mt-2 text-sm text-gray-600">
                  Managing resources for: <span className="font-medium">{selectedService.title}</span>
                </p>
              )}
            </div>
            <WorshipResourceManagement selectedServiceId={selectedService?.id || null} />
          </div>
        );
      case "analytics":
        return <AnalyticsDashboard />;
      case "songs":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SongProposals />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Worship Sets</h2>
              <div className="space-y-4">
                {worshipSets.map((set) => (
                  <div
                    key={set.id}
                    className="p-4 border rounded-lg cursor-pointer"
                    onClick={() => handleWorshipSetSelect(set.id)}
                  >
                    <h3 className="font-semibold">{set.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(set.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              {selectedWorshipSet && (
                <div className="mt-6">
                  <SongArrangement
                    worshipSetId={selectedWorshipSet.id}
                    songs={selectedWorshipSet.arrangedSongs}
                    allSongProposals={songs}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "stream":
        return <StreamManagement />;
      case "announcements":
        return <AnnouncementBoard ministryId={worshipMinistryId} isViewOnly={false} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">
              Worship Leader Dashboard
            </h1>
            <p className="text-gray-600">Manage worship services, teams, and resources</p>
          </div>
          <button
            onClick={() => setShowChatModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <MessageSquare size={18} />
            Messages
          </button>
        </motion.div>

        {/* Ministry Creation Form */}
        <AnimatePresence>
          {showCreateMinistryForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-lg bg-white shadow-sm border border-blue-100 overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Create Worship Ministry</h3>
              <p className="text-gray-600 mb-4">Create the Worship Ministry to manage your team members.</p>
              <form onSubmit={handleCreateWorshipMinistry} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Name</label>
                  <input
                    type="text"
                    value={newMinistryName}
                    onChange={(e) => setNewMinistryName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Leader</label>
                  <select
                    value={newMinistryLeaderId || ""}
                    onChange={(e) => setNewMinistryLeaderId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a leader</option>
                    {allUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Ministry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateMinistryForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-1 flex overflow-x-auto">
          {["services", "team", "resources", "analytics", "songs", "stream", "announcements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "services" && <Calendar size={16} />}
              {tab === "team" && <Users size={16} />}
              {tab === "resources" && <Layout size={16} />}
              {tab === "analytics" && <BarChart3 size={16} />}
              {tab === "songs" && <Music size={16} />}
              {tab === "stream" && <Video size={16} />}
              {tab === "announcements" && <MessageSquare size={16} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search and Filter for Services Tab */}
        {activeTab === "services" && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="SERVICE">Service</option>
                <option value="MEETING">Meeting</option>
                <option value="EVENT">Event</option>
              </select>
              <button
                onClick={() => {
                  setNewServiceTitle("");
                  setNewServiceDate("");
                  setNewServiceLocation("");
                  setNewServiceType("SERVICE");
                  setEditingService(null);
                  setShowServiceForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Service
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>{renderTabContent()}</div>

        {/* Chat Modal */}
        <AnimatePresence>
          {showChatModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Team Chat</h3>
                  <button onClick={() => setShowChatModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  {/* Conversations List */}
                  <div className="w-1/3 border-r overflow-y-auto">
                    <div className="p-3">
                      <h4 className="font-medium text-gray-700 mb-2">Conversations</h4>
                      {conversations.length > 0 ? (
                        <div className="space-y-2">
                          {conversations.map((member) => (
                            <div
                              key={member.id}
                              className={`p-2 rounded-lg cursor-pointer ${
                                selectedChatMember?.id === member.id ? "bg-blue-50" : "hover:bg-gray-50"
                              }`}
                              onClick={() => setSelectedChatMember(member)}
                            >
                              <div className="font-medium text-sm">{member.name || member.email}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No conversations yet</p>
                      )}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="w-2/3 flex flex-col">
                    {selectedChatMember ? (
                      <>
                        <div className="p-4 border-b">
                          <h4 className="font-semibold">
                            Chat with {selectedChatMember.name || selectedChatMember.email}
                          </h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {chatMessages.length > 0 ? (
                            chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${
                                  msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-xs p-3 rounded-lg ${
                                    msg.senderId === session?.user?.id
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                  <p className="text-xs opacity-75 mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-8">No messages yet. Start a conversation!</div>
                          )}
                        </div>
                        <form onSubmit={handleSendChatMessage} className="p-4 border-t flex gap-2">
                          <input
                            type="text"
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Deletion</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this service? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteService}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorshipLeaderDashboard;
