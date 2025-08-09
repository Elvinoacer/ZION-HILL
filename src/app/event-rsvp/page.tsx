"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

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
    async (eventId?: string) => {
      if (!session?.user?.id) return; // Only fetch participants if user is logged in
      try {
        const url = eventId
          ? `/api/event-rsvp?eventId=${eventId}`
          : "/api/event-rsvp";
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
    fetchParticipants();
    setLoading(false);
  }, [session, fetchParticipants]);

  const handleRsvp = async (eventId: string) => {
    if (!session?.user?.id) {
      alert("Please log in to RSVP.");
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

      alert("RSVP successful!");
      fetchParticipants(); // Refresh participants list
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
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Event RSVP & Check-in
        </h1>
        <p className="text-lg text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Event RSVP & Check-in
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Event RSVP & Check-in
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        RSVP for upcoming events and manage your participation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Type: {event.type}</p>
                <p className="text-gray-600 mb-2">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                {event.location && (
                  <p className="text-gray-600">Location: {event.location}</p>
                )}
                <div className="mt-4">
                  {session?.user?.id ? (
                    isUserRegistered(event.id) ? (
                      <Button disabled>RSVP&apos;d</Button>
                    ) : (
                      <Button onClick={() => handleRsvp(event.id)}>
                        RSVP Now
                      </Button>
                    )
                  ) : (
                    <p className="text-sm text-red-500">Log in to RSVP</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">
            No events available for RSVP at the moment.
          </p>
        )}
      </div>

      {isEventsManager && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Event Check-in (Events Manager)
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Select Event for Check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {selectedEventForCheckin && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>
                  Participants for {selectedEventForCheckin.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length > 0 ? (
                  <div className="space-y-4">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <span>
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
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No participants for this event yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EventRsvpPage;
