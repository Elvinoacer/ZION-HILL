import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, User, CheckCircle } from "lucide-react"; // Added CheckCircle
import { useState, useEffect, useMemo } from "react";
import { useEventStore, Event } from "@/store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Define the extended event type
interface EventWithRsvpStatus extends Event {
  hasRsvpd: boolean;
}

interface Participant {
  id: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface MinistryEventsProps {
  ministryId: string;
}

export default function MinistryEvents({ ministryId }: MinistryEventsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { events, loading, error, fetchEvents } = useEventStore();
  const { data: session, status } = useSession();

  const [ministryEventsWithRsvp, setMinistryEventsWithRsvp] = useState<
    EventWithRsvpStatus[]
  >([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Participant[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const handleViewAttendees = async (eventId: string) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null); // Hide if already showing
      return;
    }
    setSelectedEventId(eventId);
    setAttendeesLoading(true);
    try {
      const response = await fetch(`/api/events/rsvp?eventId=${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendees");
      }
      const data = await response.json();
      setAttendees(data);
    } catch (error) {
      console.error("Fetch Attendees Error:", error);
      toast.error("Could not load attendees.");
      setSelectedEventId(null); // Hide on error
    } finally {
      setAttendeesLoading(false);
    }
  };

  const handleRsvp = async (eventId: string, eventTitle: string) => {
    if (status !== "authenticated") {
      toast.error("Please log in to RSVP.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.info(
            errorData.error || `You have already RSVP'd to ${eventTitle}.`
          );
          setMinistryEventsWithRsvp((prevEvents) =>
            prevEvents.map((e) =>
              e.id === eventId ? { ...e, hasRsvpd: true } : e
            )
          );
        } else {
          throw new Error(errorData.error || `Failed to RSVP to ${eventTitle}`);
        }
      } else {
        toast.success(`Successfully RSVP'd to ${eventTitle}!`);
        setMinistryEventsWithRsvp((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId ? { ...e, hasRsvpd: true } : e
          )
        );
      }
      fetchEvents();
    } catch (err: any) {
      console.error("RSVP Error:", err);
      toast.error(err.message || "An unexpected error occurred during RSVP.");
    }
  };

  const handleCancelRsvp = async (eventId: string, eventTitle: string) => {
    if (status !== "authenticated") {
      toast.error("Please log in to manage your RSVP.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    try {
      // Assuming a DELETE request to the same endpoint for cancellation
      const response = await fetch("/api/events/rsvp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to cancel RSVP for ${eventTitle}`
        );
      } else {
        toast.success(`Your RSVP for ${eventTitle} has been cancelled.`);
        setMinistryEventsWithRsvp((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId ? { ...e, hasRsvpd: false } : e
          )
        );
      }
      fetchEvents();
    } catch (err: any) {
      console.error("Cancel RSVP Error:", err);
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const filterAndCheckRsvp = async () => {
      const filtered = events.filter(
        (event) => event.ministryId === ministryId
      );

      if (status === "authenticated" && session?.user?.id) {
        const userId = session.user.id;
        const eventsWithRsvp = await Promise.all(
          filtered.map(async (event) => {
            try {
              const response = await fetch(
                `/api/events/rsvp?eventId=${event.id}&userId=${userId}`
              );
              if (response.ok) {
                const data = await response.json();
                return { ...event, hasRsvpd: data.rsvpd };
              }
              return { ...event, hasRsvpd: false };
            } catch (err) {
              console.error(
                `Error checking RSVP status for event: ${event.title}`,
                err
              );
              return { ...event, hasRsvpd: false }; // Default to false on error
            }
          })
        );
        setMinistryEventsWithRsvp(eventsWithRsvp);
      } else {
        setMinistryEventsWithRsvp(
          filtered.map((event) => ({ ...event, hasRsvpd: false }))
        );
      }
    };

    if (events.length > 0) {
      filterAndCheckRsvp();
    }
  }, [events, ministryId, session, status]);

  const displayedEvents = useMemo(() => {
    const upcoming = ministryEventsWithRsvp.filter(
      (event) => new Date(event.date) >= new Date()
    );
    const past = ministryEventsWithRsvp.filter(
      (event) => new Date(event.date) < new Date()
    );
    return { upcoming, past };
  }, [ministryEventsWithRsvp]);

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="ministry-events-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          id="ministry-events-heading"
          className="text-xl font-semibold text-gray-800"
        >
          Ministry Events
        </h3>
        <div className="flex space-x-2" role="tablist" aria-label="Event tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-300 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === "upcoming"}
            aria-controls="upcoming-events"
            id="upcoming-tab"
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-300 ${
              activeTab === "past"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === "past"}
            aria-controls="past-events"
            id="past-tab"
          >
            Past Events
          </button>
        </div>
      </div>

      <div
        id={`${activeTab}-events`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        className="space-y-4"
      >
        {loading ? (
          <div className="text-center py-12 text-gray-600">
            Loading events...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 p-4 rounded-lg">
            <p className="font-semibold">Failed to load events.</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : displayedEvents[activeTab].length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No {activeTab} events found.
          </div>
        ) : (
          displayedEvents[activeTab].map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -2 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              role="article"
              aria-labelledby={`event-title-${event.id}`}
            >
              <div className="flex justify-between items-start">
                <h4
                  id={`event-title-${event.id}`}
                  className="font-semibold text-lg mb-2 text-gray-800"
                >
                  {event.title}
                </h4>
                {event.hasRsvpd && activeTab === "upcoming" && (
                  <div className="flex items-center text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span>You&apos;re going!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar
                    className="mr-2 h-4 w-4 text-blue-500"
                    aria-hidden="true"
                  />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock
                    className="mr-2 h-4 w-4 text-blue-500"
                    aria-hidden="true"
                  />
                  {event.time}
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin
                    className="mr-2 h-4 w-4 text-blue-500"
                    aria-hidden="true"
                  />
                  {event.location}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <User
                    className="mr-2 h-4 w-4 text-blue-500"
                    aria-hidden="true"
                  />
                  {attendees.length || 0} attending
                </div>

                <div className="flex space-x-2">
                  {activeTab === "upcoming" && (
                    <>
                      {event.hasRsvpd ? (
                        <button
                          onClick={() =>
                            handleCancelRsvp(event.id, event.title)
                          }
                          className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          aria-label={`Cancel RSVP for ${event.title}`}
                        >
                          Cancel RSVP
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRsvp(event.id, event.title)}
                          className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                          aria-label={`RSVP to ${event.title}`}
                        >
                          RSVP
                        </button>
                      )}
                      <button
                        onClick={() => handleViewAttendees(event.id)}
                        className="text-xs text-black border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label={`View attendees for ${event.title}`}
                      >
                        {selectedEventId === event.id
                          ? "Hide Attendees"
                          : "View Attendees"}
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/events/${event.id}`)
                        }
                        className="text-xs text-black border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label={`View details for ${event.title}`}
                      >
                        Details
                      </button>
                    </>
                  )}
                  {activeTab === "past" && (
                    <button
                      className="text-xs border text-black border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      aria-label={`View report for ${event.title}`}
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {selectedEventId === event.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    {attendeesLoading ? (
                      <p>Loading attendees...</p>
                    ) : attendees.length > 0 ? (
                      <ul className="space-y-2">
                        {attendees.map((participant) => (
                          <li
                            key={participant.id}
                            className="flex items-center text-sm"
                          >
                            <img
                              src={
                                participant.user.image ||
                                "/images/default-avatar.png"
                              }
                              alt={participant.user.name || "User"}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{participant.user.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No attendees yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
