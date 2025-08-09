"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  Check,
  X,
  Plus,
  ChevronRight,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { Event, EventType } from "@/generated/prisma";
import { useEventStore } from "@/store/eventStore";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface EventsOverviewProps {
  events: Event[];
}

export default function EventsOverview({ events }: EventsOverviewProps) {
  const { rsvpToEvent, createEvent, fetchEvents } = useEventStore();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "my">(
    "upcoming"
  );
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    type: "SERVICE" as EventType,
    date: "",
    location: "",
    description: "",
    image: "",
    time: "",
    ministryId: "",
    capacity: 0,
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [ministries, setMinistries] = useState<{ id: string; name: string }[]>(
    []
  ); // New state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image preview
  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  // Fetch ministries when modal opens
  useEffect(() => {
    if (showCreateEventModal && ministries.length === 0) {
      const fetchMinistries = async () => {
        try {
          const response = await fetch("/api/ministries");
          if (!response.ok) {
            throw new Error("Failed to fetch ministries");
          }
          const data = await response.json();
          setMinistries(data);
        } catch (error) {
          console.error("Error fetching ministries:", error);
          toast.error("Failed to load ministries.");
        }
      };
      fetchMinistries();
    }
  }, [showCreateEventModal, ministries.length]); // Dependencies

  const handleRSVP = async (id: string, response: boolean) => {
    try {
      if (response) {
        await rsvpToEvent(id, "user-id-placeholder");
        toast.success("RSVP successful!");
      } else {
        toast.info("RSVP declined");
      }
      fetchEvents();
    } catch (error) {
      console.error("RSVP Error:", error);
      toast.error("RSVP failed");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating event...");

    try {
      // First upload image if selected
      let imageUrl = newEventData.image;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const uploadToast = toast.loading("Uploading image...");
        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
        toast.dismiss(uploadToast);
        toast.success("Image uploaded successfully");
      }

      // Then create the event with all location data
      await createEvent({
        title: newEventData.title,
        type: newEventData.type,
        date: new Date(newEventData.date),
        location: newEventData.location || null,
        description: newEventData.description || null,
        imageUrl: imageUrl || null,
        latitude: newEventData.latitude,
        longitude: newEventData.longitude,
        ministryId: newEventData.ministryId || null,
        tags: [],
        groupId: null,
        createdAt: new Date(),
        time: newEventData.time, // Add time here
      });

      toast.dismiss(loadingToast);
      toast.success("Event created successfully!");

      // Reset form
      setShowCreateEventModal(false);
      setNewEventData({
        title: "",
        type: "SERVICE",
        date: "",
        location: "",
        description: "",
        image: "",
        time: "",
        ministryId: "",
        capacity: 0,
        latitude: null,
        longitude: null,
      });
      setSelectedImage(null);
      setImagePreview(null);
      setSearchQuery("");
      setMarkerPosition(null);

      fetchEvents();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Create Event Error:", error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.warning("Please enter a search query");
      return;
    }

    const loadingToast = toast.loading("Searching location...");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await res.json();

      if (data[0]) {
        const { lat, lon, display_name } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        setNewEventData((prev) => ({
          ...prev,
          location: display_name,
          latitude: parsedLat,
          longitude: parsedLon,
        }));
        setMarkerPosition({ lat: parsedLat, lng: parsedLon });

        toast.dismiss(loadingToast);
        toast.success("Location found!");
      } else {
        toast.dismiss(loadingToast);
        toast.warning("No results found for the search query");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Search Error:", error);
      toast.error("Failed to search location");
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      if (data.display_name) {
        setNewEventData((prev) => ({
          ...prev,
          location: data.display_name,
          latitude: lat,
          longitude: lng,
        }));
        toast.success("Location selected");
      }
    } catch (error) {
      console.error("Reverse Geocode Error:", error);
      toast.error("Failed to get location details");
    }
  };

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );
  const myEvents = upcomingEvents.filter((event) => event.type === "SERVICE");

  const displayedEvents = {
    upcoming: upcomingEvents,
    past: pastEvents,
    my: myEvents,
  };

  const disabledDates = events.map(event => new Date(event.date)); // New line

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden ring-1 ring-blue-100/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="region"
      aria-labelledby="events-overview-heading"
    >
      {/* Header Section */}
      <header className="p-6 border-b border-blue-100/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.h2
            id="events-overview-heading"
            className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CalendarDays
              className="mr-2 h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
            Church Events
          </motion.h2>
          <motion.button
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 hover:shadow-indigo-200/50 hover:translate-y-[-2px]"
            aria-label="Create a new event"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Create Event
          </motion.button>
        </div>

        {/* Navigation Tabs */}
        <nav
          className="flex space-x-2 sm:space-x-4 border-b border-gray-200/50 -mb-px"
          role="tablist"
          aria-label="Event tabs"
        >
          {(["upcoming", "past", "my"] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 font-medium text-sm sm:text-base focus:outline-none transition-all duration-200 ease-out ${
                activeTab === tab
                  ? "text-indigo-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${tab}-events`}
              id={`${tab}-tab`}
              whileHover={{ scale: 1.05 }}
            >
              {tab === "upcoming" && "Upcoming"}
              {tab === "past" && "Past Events"}
              {tab === "my" && "My Events"}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <div
        id={`${activeTab}-events`}
        className="p-6"
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
      >
        {displayedEvents[activeTab].length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No {activeTab} events found
            </h3>
            <p className="text-gray-500 max-w-md">
              {activeTab === "upcoming"
                ? "Check back later for upcoming church events and activities."
                : activeTab === "past"
                ? "No past events to display at this time."
                : "You haven't registered for any events yet."}
            </p>
            {activeTab === "upcoming" && (
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
              >
                Create an event <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {displayedEvents[activeTab].map((event) => (
              <motion.article
                key={event.id}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200/30 hover:ring-indigo-200/70 transition-all duration-300"
                aria-labelledby={`event-title-${event.id}`}
              >
                <div className="flex flex-col h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={event.imageUrl || "/placeholder-event.jpg"}
                      alt={`Image for ${event.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      width={400}
                      height={192}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3
                        id={`event-title-${event.id}`}
                        className="text-xl font-bold text-white"
                      >
                        {event.title}
                      </h3>
                      {event.ministryId && (
                        <span className="inline-block bg-white/90 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                          {event.ministryId}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <CalendarDays
                          className="mr-1.5 h-4 w-4 text-indigo-600"
                          aria-hidden="true"
                        />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {event.time && (
                        <div className="flex items-center">
                          <Clock
                            className="mr-1.5 h-4 w-4 text-indigo-600"
                            aria-hidden="true"
                          />
                          {event.time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin
                            className="mr-1.5 h-4 w-4 text-indigo-600"
                            aria-hidden="true"
                          />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                        {event.description}
                      </p>
                    )}

                    {activeTab === "upcoming" && (
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-600">
                            {event.attendees || 0}/{event.capacity || 0}{" "}
                            attending
                          </span>
                          <span className="text-xs font-medium text-indigo-600">
                            {Math.round(
                              ((event.attendees || 0) / (event.capacity || 1)) *
                                100
                            )}
                            % full
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                ((event.attendees || 0) /
                                  (event.capacity || 1)) *
                                100
                              }%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={() => handleRSVP(event.id, true)}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                              event.rsvp
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 hover:shadow-green-200/70"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300"
                            }`}
                            aria-label={`Confirm attendance for ${event.title}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Check
                              className="mr-1.5 h-4 w-4"
                              aria-hidden="true"
                            />
                            {event.rsvp ? "Attending" : "RSVP"}
                          </motion.button>
                          {!event.rsvp && (
                            <motion.button
                              onClick={() => handleRSVP(event.id, false)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                              aria-label={`Decline attendance for ${event.title}`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <X
                                className="mr-1.5 h-4 w-4"
                                aria-hidden="true"
                              />
                              Decline
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "past" && (
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Attendance:
                            </span>{" "}
                            <span className="text-indigo-600">
                              {event.attendees || 0}
                            </span>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors">
                            View Details{" "}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "my" && (
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Your role:
                            </span>{" "}
                            <span className="text-indigo-600">
                              {event.role || "Attendee"}
                            </span>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors">
                            View Details{" "}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEventModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-event-heading"
            >
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2
                    id="create-event-heading"
                    className="text-2xl font-bold text-gray-900"
                  >
                    Create New Event
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Fill out the form below to create a new church event.
                  </p>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="space-y-1">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newEventData.title}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                        required
                      />
                    </div>

                    {/* Event Type */}
                    <div className="space-y-1">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Event Type *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={newEventData.type}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            type: e.target.value as EventType,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                        required
                      >
                        <option value="SERVICE">Service</option>
                        <option value="MEETING">Meeting</option>
                        <option value="TRIP">Trip</option>
                        <option value="APPOINTMENT">Appointment</option>
                        <option value="CLASS">Class</option>
                        <option value="EVENT">Event</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date *
                      </label>
                      <div className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors">
                        <DayPicker
                          mode="single"
                          selected={newEventData.date ? new Date(newEventData.date) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setNewEventData({
                                ...newEventData,
                                date: format(date, 'yyyy-MM-dd'),
                              });
                            } else {
                              setNewEventData({
                                ...newEventData,
                                date: '',
                              });
                            }
                          }}
                          disabled={disabledDates}
                          className="w-full"
                          styles={{
                            caption: { display: 'flex', justifyContent: 'space-between' },
                            head_row: { display: 'flex', justifyContent: 'space-around' },
                            row: { display: 'flex', justifyContent: 'space-around' },
                            cell: { flex: '1', textAlign: 'center' },
                            day_selected: { backgroundColor: 'var(--blue-600)', color: 'white' },
                            day_today: { fontWeight: 'bold' },
                            day_disabled: { color: 'var(--gray-400)', cursor: 'not-allowed' },
                          }}
                        />
                      </div>
                      {newEventData.date && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected Date: {format(new Date(newEventData.date), 'PPP')}
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={newEventData.time}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            time: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                        required
                      />
                    </div>

                    {/* Capacity */}
                    <div className="space-y-1">
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Capacity
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        min="0"
                        value={newEventData.capacity}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            capacity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      />
                    </div>

                    {/* Ministry ID */}
                    <div className="space-y-1">
                      <label
                        htmlFor="ministryId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Ministry
                      </label>
                      <select
                        required
                        id="ministryId"
                        name="ministryId"
                        value={newEventData.ministryId}
                        onChange={(e) =>
                          setNewEventData({
                            ...newEventData,
                            ministryId: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      >
                        <option value="">Select a Ministry</option>
                        {ministries.map((ministry) => (
                          <option key={ministry.id} value={ministry.id}>
                            {ministry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a place..."
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors pr-10"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                        aria-label="Search location"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-2 h-64 rounded-lg overflow-hidden border border-gray-200">
                      <MapContainer
                        center={[51.505, -0.09]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker
                          markerPosition={markerPosition}
                          setMarkerPosition={setMarkerPosition}
                          reverseGeocode={reverseGeocode}
                        />
                      </MapContainer>
                    </div>

                    {newEventData.location && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {newEventData.location}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-medium">Latitude:</span>{" "}
                            {newEventData.latitude?.toFixed(6)}
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-medium">Longitude:</span>{" "}
                            {newEventData.longitude?.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newEventData.description}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                      placeholder="Enter event description..."
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Event Image
                    </label>

                    <div className="mt-1 flex flex-col sm:flex-row gap-4">
                      {/* File Input */}
                      <div className="flex-1">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF (MAX. 5MB)
                              </p>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error("File size exceeds 5MB limit");
                                    return;
                                  }
                                  setSelectedImage(file);
                                }
                              }}
                              ref={fileInputRef}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="flex-1">
                        {imagePreview ? (
                          <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={imagePreview}
                              alt="Preview of selected image"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImage(null);
                                setImagePreview(null);
                                if (fileInputRef.current)
                                  fileInputRef.current.value = "";
                              }}
                              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-sm hover:bg-white transition-colors"
                              aria-label="Remove image"
                            >
                              <X className="h-4 w-4 text-gray-700" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-gray-400">
                            No image selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        "Create Event"
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function LocationMarker({
  markerPosition,
  setMarkerPosition,
  reverseGeocode,
}: {
  markerPosition: { lat: number; lng: number } | null;
  setMarkerPosition: (pos: { lat: number; lng: number } | null) => void;
  reverseGeocode: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (markerPosition) {
      map.setView(markerPosition, 15);
    }
  }, [markerPosition, map]);

  return markerPosition ? (
    <Marker position={markerPosition}>
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
}
