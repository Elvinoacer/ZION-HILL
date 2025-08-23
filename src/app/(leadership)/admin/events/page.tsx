"use client";

import dynamic from "next/dynamic";
const CreateEventModal = dynamic(
  () => import("@/components/CreateEventModal"),
  { ssr: false }
);
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import {
  Edit,
  Loader2,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Filter,
  Search,
  X,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  description?: string;
  imageUrl?: string;
}

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const eventTypes = [
    {
      value: "SERVICE",
      label: "Service",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "MEETING",
      label: "Meeting",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "TRIP",
      label: "Trip",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      value: "APPOINTMENT",
      label: "Appointment",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "CLASS",
      label: "Class",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      value: "EVENT",
      label: "Event",
      color: "bg-pink-100 text-pink-800 border-pink-200",
    },
    {
      value: "BOOKING",
      label: "Booking",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const confirmDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setError(null);
    try {
      const res = await fetch(`/api/events?id=${eventToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // Filter events based on search and type filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || event.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter((event) => new Date(event.date) >= new Date())
      .length,
    past: events.filter((event) => new Date(event.date) < new Date()).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-blue-600 mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Event Management
            </h1>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Event Management
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
                <button
                  onClick={fetchEvents}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Event Management
          </h1>
          <p className="text-lg text-gray-600">
            Plan and manage church events, including services, conferences, and
            training sessions.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.upcoming}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">Past Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.past}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setEditingEvent(null);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Events</CardTitle>
                  <CardDescription className="text-blue-100">
                    {filteredEvents.length} of {events.length} events
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {typeFilter === "all"
                    ? "All Types"
                    : eventTypes.find((t) => t.value === typeFilter)?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {filteredEvents.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-x-auto"
                  >
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium">
                            Event
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Date & Time
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Location
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Type
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvents.map((event) => {
                          const eventType = eventTypes.find(
                            (t) => t.value === event.type
                          );
                          const isPast = new Date(event.date) < new Date();

                          return (
                            <motion.tr
                              key={event.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`hover:bg-gray-50 ${
                                isPast ? "opacity-70" : ""
                              }`}
                            >
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  {event.imageUrl ? (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <ImageIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                      {event.title}
                                    </h3>
                                    {event.description && (
                                      <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                                        {event.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {event.date
                                    ? format(
                                        parseISO(event.date),
                                        "MMM d, yyyy h:mm a"
                                      )
                                    : "N/A"}
                                </div>
                                {isPast && (
                                  <Badge
                                    variant="outline"
                                    className="mt-1 bg-gray-100 text-gray-700"
                                  >
                                    Past Event
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {event.location ? (
                                  <div className="flex items-center text-gray-700">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="truncate">
                                      {event.location}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {eventType ? (
                                  <Badge
                                    className={`${eventType.color} rounded-md`}
                                  >
                                    {eventType.label}
                                  </Badge>
                                ) : (
                                  event.type
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingEvent(event);
                                      setIsModalOpen(true);
                                    }}
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => confirmDelete(event.id)}
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center"
                  >
                    <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No events found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || typeFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first event"}
                      </p>
                      <Button
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditingEvent(null);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Event
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md rounded-xl shadow-xl border-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteEvent}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
              >
                Delete Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchEvents}
          eventToEdit={editingEvent}
        />
      </div>
    </div>
  );
};

export default AdminEventsPage;
