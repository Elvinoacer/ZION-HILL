"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useEventStore, Event } from "@/store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { events, loading, error, fetchEvents } = useEventStore();
  const { data: session, status } = useSession();
  const [ministryEventsWithRsvp, setMinistryEventsWithRsvp] = useState<
    EventWithRsvpStatus[]
  >([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Participant[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [showRsvpConfirmation, setShowRsvpConfirmation] = useState<{
    eventId: string;
    title: string;
  } | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState<{
    eventId: string;
    title: string;
  } | null>(null);

  const handleViewAttendees = async (eventId: string) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
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
      toast.error("Could not load attendees.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      setSelectedEventId(null);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const handleRsvp = async (eventId: string, eventTitle: string) => {
    if (status !== "authenticated") {
      toast.error("Please log in to RSVP.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }
    if (!session?.user?.id) {
      toast.error("User ID not available. Please log in again.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
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
            errorData.error || `You have already RSVP'd to ${eventTitle}.`,
            {
              icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
            }
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
        setShowRsvpConfirmation({ eventId, title: eventTitle });
        setMinistryEventsWithRsvp((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId ? { ...e, hasRsvpd: true } : e
          )
        );
        toast.success(`Successfully RSVP'd to ${eventTitle}!`, {
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        });
      }
      fetchEvents();
    } catch (err: any) {
      console.error("RSVP Error:", err);
      toast.error(err.message || "An unexpected error occurred during RSVP.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  const handleCancelRsvp = async (eventId: string, eventTitle: string) => {
    if (status !== "authenticated") {
      toast.error("Please log in to manage your RSVP.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }
    if (!session?.user?.id) {
      toast.error("User ID not available. Please log in again.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    try {
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
        setShowCancelConfirmation(null);
        setMinistryEventsWithRsvp((prevEvents) =>
          prevEvents.map((e) =>
            e.id === eventId ? { ...e, hasRsvpd: false } : e
          )
        );
        toast.success(`Your RSVP for ${eventTitle} has been cancelled.`, {
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        });
      }
      fetchEvents();
    } catch (err: any) {
      console.error("Cancel RSVP Error:", err);
      toast.error(err.message || "An unexpected error occurred.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
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
              return { ...event, hasRsvpd: false };
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

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-12 w-12 text-indigo-600" />
          <p className="text-sm sm:text-base text-gray-600">
            Loading events...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-red-800 mb-4">
            Error Loading Events
          </h3>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <Button
            onClick={fetchEvents}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="ministry-events-heading"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3
          id="ministry-events-heading"
          className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Ministry Events
        </h3>
        <div className="flex space-x-2" role="tablist" aria-label="Event tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              activeTab === "past"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        {displayedEvents[activeTab].length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 text-gray-600"
          >
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm sm:text-base">No {activeTab} events found.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {displayedEvents[activeTab].map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -2 }}
                className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50"
                role="article"
                aria-labelledby={`event-title-${event.id}`}
              >
                <div className="flex justify-between items-start">
                  <h4
                    id={`event-title-${event.id}`}
                    className="font-semibold text-base sm:text-lg text-gray-800"
                  >
                    {event.title}
                  </h4>
                  {event.hasRsvpd && activeTab === "upcoming" && (
                    <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      <span>You&apos;re going!</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                  <motion.div
                    className="flex items-center text-gray-600"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Calendar
                      className="mr-2 h-4 w-4 text-indigo-500"
                      aria-hidden="true"
                    />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </motion.div>

                  <motion.div
                    className="flex items-center text-gray-600"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Clock
                      className="mr-2 h-4 w-4 text-indigo-500"
                      aria-hidden="true"
                    />
                    {event.time}
                  </motion.div>

                  <motion.div
                    className="flex items-center text-gray-600"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <MapPin
                      className="mr-2 h-4 w-4 text-indigo-500"
                      aria-hidden="true"
                    />
                    {event.location}
                  </motion.div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <User
                      className="mr-2 h-4 w-4 text-indigo-500"
                      aria-hidden="true"
                    />
                    {attendees.length || 0} attending
                  </div>

                  <div className="flex space-x-2">
                    {activeTab === "upcoming" && (
                      <>
                        {event.hasRsvpd ? (
                          <Button
                            onClick={() =>
                              setShowCancelConfirmation({
                                eventId: event.id,
                                title: event.title,
                              })
                            }
                            className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            aria-label={`Cancel RSVP for ${event.title}`}
                          >
                            Cancel RSVP
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRsvp(event.id, event.title)}
                            className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                            aria-label={`RSVP to ${event.title}`}
                          >
                            RSVP
                          </Button>
                        )}
                        <Button
                          onClick={() => handleViewAttendees(event.id)}
                          className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                          aria-label={`View attendees for ${event.title}`}
                        >
                          {selectedEventId === event.id
                            ? "Hide Attendees"
                            : "View Attendees"}
                        </Button>
                        <Button
                          onClick={() =>
                            (window.location.href = `/events/${event.id}`)
                          }
                          className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                          aria-label={`View details for ${event.title}`}
                        >
                          Details
                        </Button>
                      </>
                    )}
                    {activeTab === "past" && (
                      <Button
                        className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                        aria-label={`View report for ${event.title}`}
                      >
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {selectedEventId === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      {attendeesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                        </div>
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
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                              />
                              <span>
                                {participant.user.name || "Anonymous"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No attendees yet.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {showRsvpConfirmation && (
          <Dialog
            open={!!showRsvpConfirmation}
            onOpenChange={() => setShowRsvpConfirmation(null)}
          >
            <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>RSVP Confirmed</span>
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  You have successfully RSVP'd to {showRsvpConfirmation.title}!
                  We look forward to seeing you there.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => setShowRsvpConfirmation(null)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {showCancelConfirmation && (
          <Dialog
            open={!!showCancelConfirmation}
            onOpenChange={() => setShowCancelConfirmation(null)}
          >
            <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                  Cancel RSVP
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  Are you sure you want to cancel your RSVP for{" "}
                  {showCancelConfirmation.title}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirmation(null)}
                  className="mr-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Keep RSVP
                </Button>
                <Button
                  onClick={() =>
                    handleCancelRsvp(
                      showCancelConfirmation.eventId,
                      showCancelConfirmation.title
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Cancel RSVP
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </motion.div>
  );
}
