// src/app/events-manager/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/generated/prisma";
import { useEventStore } from "@/store/eventStore";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Plus,
  Users,
  MapPin,
  AlertCircle,
  Filter,
  Search,
  Download,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const EventsManagerDashboard = () => {
  const { events, fetchEvents, loading, error } = useEventStore();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Fetch all events when the component mounts
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    // Update local state when events from store change
    setAllEvents(events);
    setFilteredEvents(events);
  }, [events]);

  // Filter events based on search term and filters
  useEffect(() => {
    let result = allEvents;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((event) => event.type === typeFilter);
    }

    // Apply status filter (past/upcoming)
    if (statusFilter !== "all") {
      const now = new Date();
      result = result.filter((event) => {
        const eventDate = parseISO(event.date);
        return statusFilter === "upcoming" ? eventDate >= now : eventDate < now;
      });
    }

    setFilteredEvents(result);
  }, [searchTerm, typeFilter, statusFilter, allEvents]);

  const getEventStatus = (eventDate: string) => {
    const date = parseISO(eventDate);
    const now = new Date();
    return date >= now ? "upcoming" : "past";
  };

  const getStatusBadge = (eventDate: string) => {
    const status = getEventStatus(eventDate);
    return (
      <Badge
        variant={status === "upcoming" ? "default" : "secondary"}
        className={
          status === "upcoming"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : ""
        }
      >
        {status === "upcoming" ? "Upcoming" : "Past"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading events...
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
            Error Loading Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Button
            onClick={() => fetchEvents()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Get unique event types for filter
  const eventTypes = [...new Set(allEvents.map((event) => event.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Events Manager Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and track all your church events and RSVPs
              </p>
            </div>
            <Link href="/events-manager/create" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Create Event
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Events
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {allEvents.length}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                  <CalendarDays className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Upcoming Events
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {
                      allEvents.filter(
                        (event) => getEventStatus(event.date) === "upcoming"
                      ).length
                    }
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Event Types
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {eventTypes.length}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
                  <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Capacity
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {allEvents.reduce(
                      (sum, event) => sum + (event.capacity || 0),
                      0
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Event Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-12 text-center">
              <CalendarDays className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "No events match your search criteria"
                  : "No events found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first event to get started"}
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
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold line-clamp-2">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-blue-100/90 text-sm mt-1">
                              <CalendarDays className="inline-block h-4 w-4 mr-1" />
                              {format(parseISO(event.date), "PPP")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(event.date)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4 flex-1">
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            <span className="font-medium">Type:</span>{" "}
                            {event.type}
                          </p>

                          {event.location && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                              <span className="line-clamp-2">
                                {event.location}
                              </span>
                            </p>
                          )}

                          {event.capacity !== undefined &&
                            event.capacity !== null && (
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <span className="font-medium">Capacity:</span>{" "}
                                {event.capacity === 0
                                  ? "Unlimited"
                                  : event.capacity}
                              </p>
                            )}
                        </div>

                        <Link
                          href={`/events-manager/dashboard/${event.id}`}
                          passHref
                          className="block mt-auto"
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 flex items-center justify-center">
                            View RSVPs <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
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

export default EventsManagerDashboard;
