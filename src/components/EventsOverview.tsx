"use client";

import { Event } from "@/generated/prisma";
import { useEventStore } from "@/store/eventStore";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CreateEventModal from "./CreateEventModal";
import Link from "next/link";

interface EventsOverviewProps {
  events: Event[];
  currentUserId: string | undefined;
}

export default function EventsOverview({
  events,
  currentUserId,
}: EventsOverviewProps) {
  const { rsvpToEvent, fetchEvents } = useEventStore();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "my">(
    "upcoming"
  );
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const handleRSVP = async (id: string, response: boolean) => {
    try {
      if (!currentUserId) {
        toast.error("Please log in to RSVP.");
        return;
      }
      if (response) {
        await rsvpToEvent(id, currentUserId);
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

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );
  const myEvents = events.filter((event) =>
    event.participants.some(
      (participant) => participant.userId === currentUserId
    )
  );

  const displayedEvents = {
    upcoming: upcomingEvents,
    past: pastEvents,
    my: myEvents,
  };

  const disabledDates = events.map((event) => new Date(event.date));

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
    hidden: { opacity: 1, y: 20 },
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
                          <Link
                            href={`events/${event.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                          >
                            View Details{" "}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
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

      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onEventCreated={fetchEvents}
        disabledDates={disabledDates}
      />
    </motion.section>
  );
}
