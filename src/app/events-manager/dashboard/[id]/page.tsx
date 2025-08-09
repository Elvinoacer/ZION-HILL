// src/app/events-manager/dashboard/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { safeFetch } from "@/lib/api";
import { Event } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  // Assuming User model has name and email
  user?: {
    name?: string;
    email?: string;
  };
}

const EventRsvpDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch event details
        const eventData = await safeFetch<Event>(`/api/events?id=${id}`);
        setEvent(eventData);

        // Fetch participants for this event
        // This will require modifying the /api/event-rsvp GET endpoint to include user details
        const participantsData = await safeFetch<Participant[]>(`/api/event-rsvp?eventId=${id}`);
        setParticipants(participantsData);

      } catch (err: any) {
        console.error("Error fetching event or participants:", err);
        setError(err.message || "Failed to load event details or participants.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Loading event RSVPs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Event not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <Link href="/events-manager/dashboard" passHref>
        <Button variant="outline" className="mb-6 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
        </Button>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title} RSVPs</h1>

      <Card className="shadow-lg rounded-lg overflow-hidden mb-8">
        <CardHeader className="bg-blue-500 text-white p-4">
          <CardTitle className="text-xl font-semibold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p className="text-gray-700">
            <strong className="font-medium">Date:</strong> {format(new Date(event.date), "PPP")}
          </p>
          {event.location && (
            <p className="text-gray-700">
              <strong className="font-medium">Location:</strong> {event.location}
            </p>
          )}
          {event.capacity !== undefined && event.capacity !== null && ( // Check for undefined and null
            <p className="text-gray-700">
              <strong className="font-medium">Capacity:</strong> {event.capacity === 0 ? "Unlimited" : event.capacity}
            </p>
          )}
          <p className="text-gray-700">
            <strong className="font-medium">Current RSVPs:</strong> {participants.length}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Users className="h-6 w-6 mr-2" /> Participants ({participants.length})
      </h2>

      {participants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-600">No one has RSVP'd to this event yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((participant) => (
            <Card key={participant.id} className="shadow-sm rounded-lg">
              <CardContent className="p-4">
                <p className="text-gray-800 font-semibold">{participant.user?.name || "N/A"}</p>
                <p className="text-gray-600 text-sm">{participant.user?.email || "N/A"}</p>
                <p className="text-gray-500 text-xs">Status: {participant.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventRsvpDetailPage;
