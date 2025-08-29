"use client";

import CreateEventModal from "@/components/CreateEventModal";
import dynamic from "next/dynamic";
const EventsOverview = dynamic(() => import("@/components/EventsOverview"), {
  ssr: false,
});
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/eventStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Edit,
  MessageSquare,
  Plus,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  attendees?: number;
  capacity?: number;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  time?: string;
  ministryId?: string;
  groupId?: string;
}

interface Financials {
  id: string;
  budget: number;
  expenses: number;
  revenue: number;
  eventId: string;
}

interface Sponsor {
  id: string;
  name: string;
  amount: number;
  contactEmail?: string;
}

const EventsManagerDashboard = () => {
  const { data: session, status } = useSession();
  const { deleteEvent, fetchEvents } = useEventStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [financials, setFinancials] = useState<Financials[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEditEventModal(true);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully!");
      fetchEvents(); // Refresh events after deletion
    } catch (err: any) {
      toast.error(`Failed to delete event: ${err.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleEventExpand = (id: string) => {
    if (expandedEvent === id) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [financialsRes, sponsorsRes, eventsRes] = await Promise.all([
          fetch("/api/financials"),
          fetch("/api/sponsors"),
          fetch("/api/events"),
        ]);

        if (!financialsRes.ok) throw new Error("Failed to fetch financials");
        if (!sponsorsRes.ok) throw new Error("Failed to fetch sponsors");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");

        const [financialsData, sponsorsData, eventsData] = await Promise.all([
          financialsRes.json(),
          sponsorsRes.json(),
          eventsRes.json(),
        ]);

        setFinancials(financialsData);
        setSponsors(sponsorsData);
        setEvents(eventsData);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await fetch(
            `/api/messages?recipientId=${session.user.id}&read=false`
          );
          if (!res.ok) throw new Error("Failed to fetch unread messages");
          const data = await res.json();
          setUnreadMessageCount(data.length);
        } catch (err) {
          console.error("Error fetching unread messages:", err);
        }
      }
    };

    const interval = setInterval(fetchUnreadMessages, 30000);
    fetchUnreadMessages();

    return () => clearInterval(interval);
  }, [session, status]);

  // Calculate summary metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  ).length;
  const totalBudget = financials.reduce(
    (sum, finance) => sum + finance.budget,
    0
  );
  const totalSponsors = sponsors.length;
  const totalSponsorship = sponsors.reduce(
    (sum, sponsor) => sum + sponsor.amount,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 h-36 animate-pulse"
                ></motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 p-6 h-96 animate-pulse"></div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 h-72 animate-pulse"></div>
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 h-72 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Events Manager Dashboard
              </h1>
            </header>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Error: {error}. Please try refreshing the page or contact
                    support if the problem persists.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Events Manager Dashboard
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Manage the complete lifecycle of church events efficiently.
            </motion.p>
          </header>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.section
              className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Events
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalEvents}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                <span>{upcomingEvents} upcoming</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </motion.section>

            <motion.section
              className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Budget
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    KES
                    {totalBudget.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <span>
                  KES {totalSponsorship.toLocaleString("en-US")} from sponsors
                </span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </motion.section>

            <motion.section
              className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Sponsors
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalSponsors}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
                <Link
                  href="/events_manager/sponsors"
                  className="flex items-center"
                >
                  View all sponsors <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.section>

            <motion.section
              className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Messages
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {unreadMessageCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
                <Link
                  href="/events-manager/inbox"
                  className="flex items-center"
                >
                  View inbox <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.section>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Events Section */}
            <motion.section
              className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-100 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upcoming Events
                </h2>
                <Button
                  onClick={() => setShowCreateEventModal(true)}
                  className="text-sm font-medium bg-blue-600 hover:bg-blue-700 flex items-center transition-colors px-4 py-2"
                  size="sm"
                >
                  Create New <Plus className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {events.length > 0 ? (
                <div className="space-y-3">
                  {events
                    .filter((event) => {
                      const eventDate = new Date(event.date);
                      const now = new Date();
                      return eventDate >= now;
                    })
                    .slice(0, 5)
                    .map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ x: 4 }}
                        className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => toggleEventExpand(event.id)}
                              className="text-left w-full focus:outline-none"
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-900 truncate pr-2">
                                  {event.title}
                                </h3>
                                {expandedEvent === event.id ? (
                                  <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                                {event.location && ` • ${event.location}`}
                              </p>
                            </button>

                            <AnimatePresence>
                              {expandedEvent === event.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-3 overflow-hidden"
                                >
                                  <p className="text-sm text-gray-600 mb-3">
                                    {event.description ||
                                      "No description available."}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                      {event.type}
                                    </span>
                                    {event.attendees !== undefined &&
                                      event.capacity !== undefined && (
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                          {event.attendees}/{event.capacity}{" "}
                                          attendees
                                        </span>
                                      )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex flex-col items-end ml-3 gap-2">
                            <div className="flex space-x-1">
                              <Link
                                href={`/events-manager/dashboard/${event.id}`}
                                passHref
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="View RSVPs"
                                  className="h-8 w-8"
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(event)}
                                aria-label="Edit event"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Delete event"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    {isDeleting === event.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md mx-auto">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this
                                      event?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your event and remove
                                      its data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(event.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  {events.filter((event) => {
                    const eventDate = new Date(event.date);
                    const now = new Date();
                    return eventDate >= now;
                  }).length > 5 && (
                    <div className="text-center mt-4">
                      <Link
                        href="/events-manager/events"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        View all events <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No upcoming events found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check back later for upcoming church events and activities.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowCreateEventModal(true)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Event
                    </Button>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Financials & Sponsors Section */}
            <div className="space-y-6">
              <motion.section
                className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Financial Overview
                </h2>
                {financials.length > 0 ? (
                  <div className="space-y-4">
                    {financials.slice(0, 3).map((finance) => {
                      const event = events.find(
                        (e) => e.id === finance.eventId
                      );
                      const progressPercentage = Math.min(
                        100,
                        (finance.expenses / finance.budget) * 100
                      );
                      const progressColor =
                        progressPercentage > 90
                          ? "bg-red-500"
                          : progressPercentage > 75
                          ? "bg-yellow-500"
                          : "bg-blue-500";

                      return (
                        <div
                          key={finance.id}
                          className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {event?.title || `Event ${finance.eventId}`}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Budget: KES
                                {finance.budget.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <div className="text-right ml-2">
                              <p
                                className={`text-sm font-medium ${
                                  finance.revenue - finance.expenses >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                KES
                                {(
                                  finance.revenue - finance.expenses
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(
                                  (finance.revenue / finance.budget) *
                                  100
                                ).toFixed(1)}
                                % of budget
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${progressColor} transition-all duration-500`}
                                style={{
                                  width: `${progressPercentage}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {financials.length > 3 && (
                      <div className="text-center mt-4">
                        <Link
                          href="/events-manager/financials"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          View all financials{" "}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No financial data
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Financial records will appear here.
                    </p>
                  </div>
                )}
              </motion.section>

              <motion.section
                className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Top Sponsors
                  </h2>
                  <Link
                    href="/events_manager/sponsors"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                  >
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {sponsors.length > 0 ? (
                  <div className="space-y-4">
                    {sponsors
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 3)
                      .map((sponsor) => (
                        <div key={sponsor.id} className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {sponsor.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              KES {sponsor.amount.toLocaleString("en-US")}
                            </p>
                            {sponsor.contactEmail && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {sponsor.contactEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    {sponsors.length > 3 && (
                      <div className="text-center mt-4">
                        <Link
                          href="/events_manager/sponsors"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          View all sponsors{" "}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No sponsors
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sponsor records will appear here.
                    </p>
                  </div>
                )}
              </motion.section>
            </div>
          </div>

          {/* Events Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <EventsOverview events={events} currentUserId={session?.user?.id} onEdit={handleEdit} onDelete={handleDelete} />
          </motion.div>

          <CreateEventModal
            isOpen={showCreateEventModal || showEditEventModal}
            onClose={() => {
              setShowCreateEventModal(false);
              setShowEditEventModal(false);
              setEditingEvent(null);
            }}
            onEventCreated={fetchEvents}
            editingEvent={editingEvent}
            onEventUpdated={() => {
              fetchEvents();
              setShowEditEventModal(false);
              setEditingEvent(null);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EventsManagerDashboard;
