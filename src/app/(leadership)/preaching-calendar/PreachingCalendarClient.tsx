"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  AlertCircle,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  BookOpen,
  Filter,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import CreateEventModal from "@/components/CreateEventModal";

// Define a local interface for the Event, matching the expected structure
interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string | Date;
  location?: string | null;
  type: string;
  imageUrl?: string | null;
  time?: string | null;
  ministryId?: string | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  speaker?: string | null;
  scripture?: string | null;
}

interface CalendarEvent extends Event {
  start?: Date;
  end?: Date;
}

// Setup the localizer
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PreachingCalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events?type=SERMON");
      if (!response.ok) {
        throw new Error("Failed to fetch sermons");
      }
      const data: Event[] = await response.json();
      const formattedEvents = data.map((event) => ({
        ...event,
        start: new Date(event.date),
        end: addHours(new Date(event.date), 1), // Assume sermons last 1 hour
      }));
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (err: any) {
      setError(err.message);
      toast.error("Could not load sermons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  useEffect(() => {
    let results = events;

    // Apply type filter
    if (typeFilter !== "all") {
      results = results.filter((event) => event.type === typeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.speaker?.toLowerCase().includes(query) ||
          event.scripture?.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(results);
  }, [events, typeFilter, searchQuery]);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
    setEventToEdit(undefined);
    setIsModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const editableEvent = { ...event };
    delete editableEvent.start;
    delete editableEvent.end;
    setEventToEdit(editableEvent);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);

  const handleEventCreated = () => {
    fetchSermons();
    setIsModalOpen(false);
    setEventToEdit(undefined);
    setSelectedDate(null);
  };

  const getEventToPassToModal = () => {
    if (eventToEdit) return eventToEdit;
    if (selectedDate) {
      return { date: selectedDate, type: "SERMON" } as Partial<Event>;
    }
    return undefined;
  };

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const handleView = useCallback((newView: View) => setView(newView), []);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3b82f6"; // Default blue

    // Different colors based on event type
    if (event.type === "SERMON") backgroundColor = "#3b82f6"; // Blue
    if (event.type === "BIBLE_STUDY") backgroundColor = "#10b981"; // Green
    if (event.type === "SPECIAL_EVENT") backgroundColor = "#f59e0b"; // Amber
    if (event.type === "CONFERENCE") backgroundColor = "#8b5cf6"; // Purple

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <Skeleton className="h-[70vh] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Calendar
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Preaching Calendar
            </h1>
            <p className="text-lg text-gray-600">
              Plan and view the sermon schedule
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setEventToEdit(undefined);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Sermon
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white border-0 shadow-lg rounded-xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sermons, speakers, or scriptures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SERMON">Sermons</SelectItem>
                  <SelectItem value="BIBLE_STUDY">Bible Studies</SelectItem>
                  <SelectItem value="SPECIAL_EVENT">Special Events</SelectItem>
                  <SelectItem value="CONFERENCE">Conferences</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || typeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}
                  className="whitespace-nowrap"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center text-xl">
                <CalendarIcon className="h-6 w-6 mr-2" />
                Sermon Calendar
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Sermon</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Bible Study</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                  <span>Special Event</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <span>Conference</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[70vh] p-4">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                date={date}
                view={view}
                onNavigate={handleNavigate}
                onView={handleView}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: ({ event }) => (
                    <div className="text-xs p-1">
                      <div className="font-semibold truncate">
                        {event.title}
                      </div>
                      {event.time && (
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  ),
                }}
                messages={{
                  today: "Today",
                  previous: "Back",
                  next: "Next",
                  month: "Month",
                  week: "Week",
                  day: "Day",
                  agenda: "Agenda",
                  date: "Date",
                  time: "Time",
                  event: "Event",
                  noEventsInRange: "No sermons scheduled for this period.",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={handleEventCreated}
          eventToEdit={getEventToPassToModal() as any}
        />
      </div>
    </motion.div>
  );
};

export default PreachingCalendarPage;
