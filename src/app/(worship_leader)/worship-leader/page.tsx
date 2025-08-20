"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WorshipTeamManagement from "@/components/worship-leader/WorshipTeamManagement";
import WorshipResourceManagement from "@/components/worship-leader/WorshipResourceManagement";
import AnnouncementBoard from "@/components/worship-leader/AnnouncementBoard";
import SongProposals from "@/components/worship-leader/SongProposals";
import ServiceDurationChart from "@/components/worship-leader/ServiceDurationChart";
import TeamParticipationChart from "@/components/worship-leader/TeamParticipationChart";
import TopSongsChart from "@/components/worship-leader/TopSongsChart";
import StreamManagement from "@/components/worship-leader/StreamManagement";
import SongArrangement from "@/components/worship-leader/SongArrangement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Edit, MapPin, Trash2 } from "lucide-react";
import { toast, Toaster } from 'sonner';

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
  arrangedSongs: string[];
  leader?: { name: string; email: string };
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

  const [worshipMinistryId, setWorshipMinistryId] = useState<string | null>(
    null
  );
  const [currentMinistryMembers, setCurrentMinistryMembers] = useState<any[]>(
    []
  ); // MinistryMember[]

  const [worshipSets, setWorshipSets] = useState<WorshipSet[]>([]);
  const [selectedWorshipSet, setSelectedWorshipSet] =
    useState<WorshipSet | null>(null);
  const [newWorshipSetTitle, setNewWorshipSetTitle] = useState("");
  const [newWorshipSetDate, setNewWorshipSetDate] = useState("");
  const [showCreateWorshipSetForm, setShowCreateWorshipSetForm] =
    useState(false);
  const [showCreateMinistryForm, setShowCreateMinistryForm] = useState(false); // New state
  const [newMinistryName, setNewMinistryName] = useState("Worship Ministry"); // Pre-fill
  const [newMinistryLeaderId, setNewMinistryLeaderId] = useState<string | null>(
    null
  ); // To select a leader
  const [allUsers, setAllUsers] = useState<User[]>([]); // To populate leader select

  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatMember, setSelectedChatMember] = useState<User | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<WorshipMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [conversations, setConversations] = useState<User[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(
    null
  );

  const handleDeleteService = async (serviceId: string) => {
    setServiceToDeleteId(serviceId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDeleteId) return;

    const originalServices = [...services];
    const serviceToRemove = services.find(s => s.id === serviceToDeleteId);

    // Optimistically update UI
    setServices(services.filter(s => s.id !== serviceToDeleteId));
    setShowDeleteConfirm(false);
    setServiceToDeleteId(null);
    setSelectedService(null); // Deselect if the deleted service was selected

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
      // Revert UI on error
      setServices(originalServices);
      toast.error(`Error deleting service: ${err.message}`, { id: "delete-service" });
      setError(err.message);
    } finally {
      // setLoading(false); // No longer needed here as UI is optimistically updated
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
          arrangedSongs: [], // Initially empty
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
          description: "", // Optional description
          leaderId: newMinistryLeaderId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create ministry");
      }

      setShowCreateMinistryForm(false);
      // Re-fetch all data to update ministry list and select the new worship ministry
      const ministriesRes = await fetch("/api/ministries");
      const ministriesData = await ministriesRes.json();
      const worshipMinistry = ministriesData.find(
        (m: any) => m.name === "Worship Ministry"
      );
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
      const res = await fetch("/api/music-proposals");
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

      if (!serviceRes.ok)
        throw new Error("Failed to fetch service duration data");
      if (!teamRes.ok)
        throw new Error("Failed to fetch team participation data");
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
      fetchServices();
      if (session?.user?.id) {
        fetchWorshipSets();
        fetchSongProposals();
        fetchAnalyticsData();

        // Fetch ministries and find Worship Ministry ID
        try {
          const ministriesRes = await fetch("/api/ministries");
          if (!ministriesRes.ok) throw new Error("Failed to fetch ministries");
          const ministriesData = await ministriesRes.json();

          const worshipMinistry = ministriesData.find(
            (m: any) => m.name === "Worship Ministry"
          );

          if (worshipMinistry) {
            setWorshipMinistryId(worshipMinistry.id);
            fetchMinistryMembers(worshipMinistry.id);
          } else {
            setShowCreateMinistryForm(true); // Show form if Worship Ministry not found
            // Fetch all users to populate leader selection
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
    fetchParticipants(service.id);
  };

  const handleAttendanceChange = async (
    participantId: string,
    newStatus: string
  ) => {
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

      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );
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
      const res = await fetch(
        `/api/worship-messages?worshipMinistryId=${worshipMinistryId}`
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const allMessages: WorshipMessage[] = await res.json();

      // Group messages by conversation partner
      const conversationsMap = new Map<string, WorshipMessage[]>();
      allMessages.forEach((msg) => {
        const otherParticipantId =
          msg.senderId === session.user.id ? msg.recipientId : msg.senderId;
        if (!conversationsMap.has(otherParticipantId)) {
          conversationsMap.set(otherParticipantId, []);
        }
        conversationsMap.get(otherParticipantId)?.push(msg);
      });

      const uniqueConversations: User[] = Array.from(
        conversationsMap.keys()
      ).map((id) => {
        const messagesForUser = conversationsMap.get(id);
        const lastMessage = messagesForUser?.[messagesForUser.length - 1];
        return {
          id: id,
          name:
            lastMessage?.senderId === id
              ? lastMessage?.sender.name
              : lastMessage?.recipient.name,
          email:
            lastMessage?.senderId === id
              ? lastMessage?.sender.email
              : lastMessage?.recipient.email,
          image:
            lastMessage?.senderId === id
              ? lastMessage?.sender.image
              : lastMessage?.recipient.image,
        };
      });
      setConversations(uniqueConversations);

      if (memberId) {
        const filteredMessages = allMessages.filter(
          (msg) =>
            (msg.senderId === session.user.id &&
              msg.recipientId === memberId) ||
            (msg.senderId === memberId && msg.recipientId === session.user.id)
        );
        setChatMessages(filteredMessages);
      } else {
        setChatMessages([]); // Clear messages if no specific member is selected
      }
    } catch (err: any) {
      console.error("Error fetching chat messages:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (showChatModal) {
      fetchChatMessages(selectedChatMember?.id);
    }
  }, [showChatModal, selectedChatMember]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedChatMember?.id || !worshipMinistryId)
      return;

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
      fetchChatMessages(selectedChatMember.id); // Refresh messages for the current conversation
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message);
    }
  };

  const [serviceDurationData, setServiceDurationData] = useState<any[]>([]);
  const [teamParticipationData, setTeamParticipationData] = useState<any[]>([]);
  const [topSongsData, setTopSongsData] = useState<any[]>([]);

  const [songs, setSongs] = useState<SongProposal[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-12 w-64 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center" // Added flex and justify-between
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">
              Worship Leader Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage worship services, teams, and resources with ease
            </p>
          </div>
          <Button
            onClick={() => setShowChatModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Messages
          </Button>
        </motion.div>

        <AnimatePresence>
          {showCreateMinistryForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 rounded-lg bg-white shadow-sm border border-blue-100 overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Create Worship Ministry
              </h3>
              <p className="text-gray-600 mb-4">
                It looks like the &quot;Worship Ministry&quot; doesn&apos;t
                exist yet. Please create it to manage your team members.
              </p>
              <form
                onSubmit={handleCreateWorshipMinistry}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="ministryName">Ministry Name</Label>
                  <Input
                    type="text"
                    id="ministryName"
                    value={newMinistryName}
                    onChange={(e) => setNewMinistryName(e.target.value)}
                    required
                    readOnly // Pre-filled, not editable
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministryLeader">Ministry Leader</Label>
                  <Select onValueChange={setNewMinistryLeaderId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Create Ministry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateMinistryForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Management Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-purple-700">
                  Service Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setNewServiceTitle("");
                    setNewServiceDate("");
                    setNewServiceLocation("");
                    setNewServiceType("SERVICE");
                    setEditingService(null);
                    setShowServiceForm(true);
                  }}
                  className="mb-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Add New Service
                </Button>

                <AnimatePresence>
                  {showServiceForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={
                        editingService ? handleUpdateService : handleAddService
                      }
                      className="space-y-4 mb-6 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          type="text"
                          id="title"
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          type="datetime-local"
                          id="date"
                          value={newServiceDate}
                          onChange={(e) => setNewServiceDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          type="text"
                          id="location"
                          value={newServiceLocation}
                          onChange={(e) =>
                            setNewServiceLocation(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newServiceType}
                          onValueChange={(value) => setNewServiceType(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SERVICE">Service</SelectItem>
                            <SelectItem value="MEETING">Meeting</SelectItem>
                            <SelectItem value="TRIP">Trip</SelectItem>
                            <SelectItem value="APPOINTMENT">
                              Appointment
                            </SelectItem>
                            <SelectItem value="CLASS">Class</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          {editingService ? "Update Service" : "Create Service"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowServiceForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Existing Services
                </h3>
                {services.length > 0 ? (
                  <ul className="space-y-3">
                    {services.map((service) => (
                      <motion.li
                        key={service.id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedService?.id === service.id
                            ? "bg-purple-50 border-purple-400 shadow-sm"
                            : "bg-white border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex flex-col">
                          {/* Service Info - Full width */}
                          <div
                            className="flex-grow min-w-0 cursor-pointer mb-3"
                            onClick={() => handleServiceSelect(service)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-100 text-purple-700 p-2 rounded-md flex-shrink-0 mt-0.5">
                                <Calendar size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {service.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(
                                      service.date
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock size={14} />
                                    {new Date(service.date).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                  {service.location && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span className="inline-flex items-center gap-1 truncate">
                                        <MapPin size={14} />
                                        {service.location}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {service.type && (
                                  <div className="mt-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {service.type}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons - Now on their own row */}
                          <div className="flex items-center justify-end gap-2 border-t pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingService(service);
                                setNewServiceTitle(service.title);
                                setNewServiceDate(
                                  service.date.substring(0, 16)
                                );
                                setNewServiceLocation(service.location || "");
                                setNewServiceType(service.type);
                                setShowServiceForm(true);
                              }}
                              className="text-purple-600 border-purple-300 hover:bg-purple-50 h-8 px-3 text-xs"
                            >
                              <Edit size={12} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteService(service.id);
                              }}
                              className="h-8 px-3 text-xs"
                            >
                              <Trash2 size={12} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No worship services found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Service Attendance */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-blue-700">
                    Attendance for{" "}
                    <span className="font-bold">{selectedService.title}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedService.date).toLocaleDateString()} •{" "}
                    {selectedService.location}
                  </p>
                </CardHeader>
                <CardContent>
                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <motion.div
                          key={participant.id}
                          whileHover={{ x: 5 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-white shadow-xs border border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white">
                              {participant.user?.name?.charAt(0) || "P"}
                            </div>
                            <span className="font-medium text-gray-700">
                              {participant.user?.name ||
                                `Participant ${participant.userId}`}
                            </span>
                          </div>
                          <Checkbox
                            checked={participant.status === "Attended"}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                participant.id,
                                checked ? "Attended" : "Registered"
                              )
                            }
                            className="h-6 w-6 border-2 border-blue-300 data-[state=checked]:bg-blue-500"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No participants found for this service
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Invite Team Members
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Members Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-indigo-700">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <WorshipTeamManagement
                  worshipMinistryId={worshipMinistryId}
                  currentMinistryMembers={currentMinistryMembers}
                  fetchMinistryMembers={fetchMinistryMembers}
                  onMessageMember={handleMessageMember}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-teal-50 border border-teal-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-teal-700">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <WorshipResourceManagement
                  selectedServiceId={selectedService?.id || null}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-amber-50 border border-amber-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-amber-700">
                  Team Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnnouncementBoard />
              </CardContent>
            </Card>
          </motion.div>

          {/* Song Proposals Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-pink-50 border border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-pink-700">Song Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <SongProposals />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-700">
                  Worship Analytics
                </CardTitle>
              </CardHeader>
              <CardContent
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{ minHeight: "300px" }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Service Duration
                  </h4>
                  <ServiceDurationChart data={serviceDurationData} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Team Participation
                  </h4>
                  <TeamParticipationChart data={teamParticipationData} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="col-span-1 p-4 bg-white rounded-lg shadow-xs border border-gray-100"
                >
                  <h4 className="text-center font-semibold text-gray-700 mb-4">
                    Top Songs
                  </h4>
                  <TopSongsChart data={topSongsData} />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Stream Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-700">Live Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <StreamManagement />
              </CardContent>
            </Card>
          </motion.div>

          {/* Song Arrangement Card */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-white to-green-50 border border-green-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-green-700">
                  Song Arrangement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Select Worship Set
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreateWorshipSetForm(true);
                        setNewWorshipSetTitle("");
                        setNewWorshipSetDate("");
                      }}
                    >
                      Create New
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showCreateWorshipSetForm && (
                      <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleCreateWorshipSet}
                        className="space-y-4 mb-4 overflow-hidden p-4 border rounded-lg bg-gray-50"
                      >
                        <h4 className="font-medium text-gray-800">
                          New Worship Set
                        </h4>
                        <div className="space-y-2">
                          <Label htmlFor="worshipSetTitle">Title</Label>
                          <Input
                            type="text"
                            id="worshipSetTitle"
                            value={newWorshipSetTitle}
                            onChange={(e) =>
                              setNewWorshipSetTitle(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="worshipSetDate">Date</Label>
                          <Input
                            type="datetime-local"
                            id="worshipSetDate"
                            value={newWorshipSetDate}
                            onChange={(e) =>
                              setNewWorshipSetDate(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit" className="flex-1">
                            Create
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateWorshipSetForm(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <Select
                    onValueChange={handleWorshipSetSelect}
                    value={selectedWorshipSet?.id || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Worship Set" />
                    </SelectTrigger>
                    <SelectContent>
                      {worshipSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.title} -{" "}
                          {new Date(set.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedWorshipSet && (
                    <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-800">
                        Selected Set: {selectedWorshipSet.title}
                      </h4>
                      <p className="text-sm text-blue-700">
                        Date:{" "}
                        {new Date(selectedWorshipSet.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-blue-700">
                        Leader: {selectedWorshipSet.leader?.name || "N/A"}
                      </p>
                    </div>
                  )}

                  {selectedWorshipSet ? (
                    <SongArrangement
                      songs={songs.filter((song) =>
                        selectedWorshipSet.arrangedSongs.includes(song.id)
                      )}
                      worshipSetId={selectedWorshipSet.id}
                      allSongProposals={songs}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>
                        Please select or create a Worship Set to arrange songs.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      <Toaster position="bottom-right" />

      {/* Chat Modal */}
        <AnimatePresence>
          {showChatModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            >
              <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
                <DialogContent className="sm:max-w-[900px] h-[80vh] p-0 flex overflow-hidden">
                  <div className="w-1/3 border-r flex flex-col">
                    <DialogHeader className="p-4 border-b">
                      <DialogTitle>Conversations</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto">
                      {conversations.length > 0 ? (
                        conversations.map((member) => (
                          <div
                            key={member.id}
                            className={`p-3 cursor-pointer hover:bg-gray-100 ${
                              selectedChatMember?.id === member.id
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => setSelectedChatMember(member)}
                          >
                            <div className="font-semibold">
                              {member.name || member.email}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">
                          No conversations yet.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-2/3 flex flex-col">
                    <DialogHeader className="p-4 border-b">
                      <DialogTitle>
                        {selectedChatMember
                          ? `Chat with ${
                              selectedChatMember.name ||
                              selectedChatMember.email
                            }`
                          : "Select a conversation"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-4 flex-grow overflow-y-auto flex flex-col-reverse">
                      {selectedChatMember ? (
                        chatMessages
                          .slice()
                          .reverse()
                          .map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex mb-2 ${
                                msg.senderId === session?.user?.id
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`rounded-lg p-3 max-w-[70%] ${
                                  msg.senderId === session?.user?.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-75 mt-1 block">
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">
                          Select a conversation from the left to view messages.
                        </div>
                      )}
                    </div>
                    {selectedChatMember && (
                      <form
                        onSubmit={handleSendChatMessage}
                        className="p-4 border-t flex gap-2"
                      >
                        <Input
                          value={newChatMessage}
                          onChange={(e) => setNewChatMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-grow"
                        />
                        <Button type="submit">Send</Button>
                      </form>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            >
              <Dialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    Are you sure you want to delete this service? This action
                    cannot be undone.
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteService}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorshipLeaderDashboard;
