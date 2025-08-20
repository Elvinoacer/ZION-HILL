"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Tag, UserCheck, XCircle } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
}

interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string; // e.g., 'Registered', 'Attended', 'Absent'
  user?: { name: string }; // Assuming user details can be included
}

const EventRsvpPage = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventForCheckin, setSelectedEventForCheckin] =
    useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await safeFetch<Event[]>("/api/events");
      setEvents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const fetchParticipants = useCallback(
    async (eventId?: string, userId?: string) => {
      if (!session?.user?.id && !eventId && !userId) return; // Only fetch if user is logged in or eventId/userId is provided
      try {
        let url = "/api/event-rsvp";
        const params = new URLSearchParams();
        if (eventId) params.append("eventId", eventId);
        if (userId) params.append("userId", userId);

        if (params.toString()) {
          url = `${url}?${params.toString()}`;
        }

        const data = await safeFetch<Participant[]>(url);
        setParticipants(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    },
    [session?.user?.id]
  );

  useEffect(() => {
    fetchEvents();
    if (session?.user?.id) {
      fetchParticipants(undefined, session.user.id); // Fetch current user's RSVPs on load
    }
    setLoading(false);
  }, [session, fetchParticipants]);

  const handleRsvp = async (eventId: string) => {
    if (!session?.user?.id) {
      alert("Please log in to RSVP."); // Consider using toast for better UX
      return;
    }

    try {
      await safeFetch("/api/event-rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: session.user.id,
          status: "Registered",
        }),
      });

      alert("RSVP successful!"); // Consider using toast for better UX
      fetchParticipants(undefined, session.user.id); // Refresh participants list for current user
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleCheckinChange = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      await safeFetch(`/api/event-rsvp?id=${participantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const isUserRegistered = (eventId: string) => {
    return participants.some(
      (p) => p.eventId === eventId && p.userId === session?.user?.id
    );
  };

  const isEventsManager = session?.user?.roles?.includes("Events Manager"); // Assuming role name

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <Skeleton className="h-64 w-full rounded-xl" /> {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <XCircle size={24} /> {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-cover bg-center rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundImage: "url('/images/hero.png')",
            minHeight: "300px",
          }} // Placeholder image
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Event RSVP & Check-in
            </h1>
            <p className="text-xl text-blue-200 mb-6 max-w-2xl">
              Join us for our upcoming events and be part of our community!
            </p>
          </div>
        </motion.section>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upcoming Events
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-blue-700">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <Tag size={16} className="text-gray-500" /> Type:{" "}
                      {event.type}
                    </p>
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" /> Date:{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" /> Location:{" "}
                        {event.location}
                      </p>
                    )}
                    <div className="mt-4">
                      {session?.user?.id ? (
                        isUserRegistered(event.id) ? (
                          <Button
                            disabled
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                          >
                            <UserCheck size={16} className="mr-2" /> RSVP&apos;d
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRsvp(event.id)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            RSVP Now
                          </Button>
                        )
                      ) : (
                        <p className="text-sm text-red-500 text-center p-2 border border-red-200 rounded-md bg-red-50">
                          Log in to RSVP
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              No events available for RSVP at the moment. Check back soon!
            </p>
          </div>
        )}

        {isEventsManager && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 p-8 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Event Check-in (Events Manager)
            </h2>
            <Card className="mb-6 border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-700">
                  Select Event for Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-200"
                  onChange={(e) => {
                    const event = events.find((ev) => ev.id === e.target.value);
                    setSelectedEventForCheckin(event || null);
                    if (event) fetchParticipants(event.id);
                  }}
                  value={selectedEventForCheckin?.id || ""}
                >
                  <option value="">-- Select an Event --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {selectedEventForCheckin && (
              <Card className="mt-4 border-green-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Participants for {selectedEventForCheckin.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {participants.length > 0 ? (
                    <div className="space-y-4">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                        >
                          <span className="font-medium text-gray-700">
                            {participant.user?.name ||
                              `Participant ${participant.userId}`}
                          </span>
                          <Checkbox
                            checked={participant.status === "Attended"}
                            onCheckedChange={(checked) =>
                              handleCheckinChange(
                                participant.id,
                                checked ? "Attended" : "Registered"
                              )
                            }
                            className="h-6 w-6 border-2 border-blue-300 data-[state=checked]:bg-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No participants for this event yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EventRsvpPage;
