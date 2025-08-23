// src/app/events-manager/dashboard/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { safeFetch } from "@/lib/api";
import { Event } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import {
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Download,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  createdAt: string;
  // Assuming User model has name and email
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    profile?: {
      avatarUrl?: string;
    };
  };
}

const EventRsvpDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch event details
        const eventData = await safeFetch<Event>(`/api/events?id=${id}`);
        setEvent(eventData);

        // Fetch participants for this event
        const participantsData = await safeFetch<Participant[]>(
          `/api/event-rsvp?eventId=${id}`
        );
        setParticipants(participantsData);
        setFilteredParticipants(participantsData);
      } catch (err: any) {
        console.error("Error fetching event or participants:", err);
        setError(
          err.message || "Failed to load event details or participants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter participants based on search term and status filter
  useEffect(() => {
    let result = participants;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (participant) =>
          participant.user?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          participant.user?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (participant) => participant.status === statusFilter
      );
    }

    setFilteredParticipants(result);
  }, [searchTerm, statusFilter, participants]);

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Status", "RSVP Date"];
    const csvData = filteredParticipants.map((participant) => [
      participant.user?.name || "N/A",
      participant.user?.email || "N/A",
      participant.user?.phone || "N/A",
      participant.status,
      format(parseISO(participant.createdAt), "PPP"),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event?.title || "event"}-rsvps.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading event RSVPs...
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
            <UserX className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Data
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link href="/events-manager/dashboard" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700/60">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            The requested event could not be found.
          </p>
          <Link href="/events-manager/dashboard" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Link href="/events-manager/dashboard" passHref>
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Event Details Card */}
            <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <CardTitle className="text-2xl font-bold">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-blue-100/90">
                  Event Details and RSVP Overview
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                  <span>{format(parseISO(event.date), "PPP 'at' p")}</span>
                </div>

                {event.location && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                    <span>{event.location}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Users className="h-5 w-5 mr-3 text-blue-500" />
                  <span>
                    {participants.length}{" "}
                    {participants.length === 1 ? "person has" : "people have"}{" "}
                    RSVP'd
                    {event.capacity &&
                      event.capacity > 0 &&
                      ` (${
                        event.capacity - participants.length
                      } spots remaining)`}
                  </span>
                </div>

                {event.description && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-semibold">
                  RSVP Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Confirmed
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {
                      participants.filter((p) => p.status === "confirmed")
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pending
                  </span>
                  <Badge variant="secondary">
                    {participants.filter((p) => p.status === "pending").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cancelled
                  </span>
                  <Badge variant="destructive">
                    {
                      participants.filter((p) => p.status === "cancelled")
                        .length
                    }
                  </Badge>
                </div>
                {event.capacity && event.capacity > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (participants.length / event.capacity) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {Math.round((participants.length / event.capacity) * 100)}
                      % Capacity
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Participants Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Users className="h-6 w-6 mr-2" /> Participants (
                {filteredParticipants.length})
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <UserX className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "No participants match your search criteria."
                    : "No one has RSVP'd to this event yet."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredParticipants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700/60">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                              {participant.user?.name?.charAt(0) || "U"}
                            </div>
                            <Badge
                              variant={getStatusBadgeVariant(
                                participant.status
                              )}
                            >
                              {participant.status}
                            </Badge>
                          </div>

                          <p className="text-gray-800 dark:text-white font-semibold mb-1">
                            {participant.user?.name || "Unknown User"}
                          </p>

                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="truncate">
                              {participant.user?.email || "N/A"}
                            </span>
                          </div>

                          {participant.user?.phone && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{participant.user.phone}</span>
                            </div>
                          )}

                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            RSVP'd on{" "}
                            {format(
                              parseISO(participant.createdAt),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventRsvpDetailPage;
