// src/app/events-manager/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/generated/prisma";
import { useEventStore } from "@/store/eventStore";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const EventsManagerDashboard = () => {
  const { events, fetchEvents, loading, error } = useEventStore();
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch all events when the component mounts
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    // Update local state when events from store change
    setAllEvents(events);
  }, [events]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Loading events...</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Events Manager Dashboard
      </h1>

      {allEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No events found.</p>
          <p className="text-gray-500">Create new events to manage RSVPs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.map((event) => (
            <Card
              key={event.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              <CardHeader className="bg-blue-500 text-white p-4">
                <CardTitle className="text-xl font-semibold">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  <CalendarDays className="inline-block h-4 w-4 mr-1" />
                  {format(new Date(event.date), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-gray-700 text-sm">
                  <strong className="font-medium">Type:</strong> {event.type}
                </p>
                {event.location && (
                  <p className="text-700 text-sm">
                    <strong className="font-medium">Location:</strong>{" "}
                    {event.location}
                  </p>
                )}
                {event.capacity !== undefined &&
                  event.capacity !== null && ( // Check for undefined and null
                    <p className="text-gray-700 text-sm">
                      <strong className="font-medium">Capacity:</strong>{" "}
                      {event.capacity === 0 ? "Unlimited" : event.capacity}
                    </p>
                  )}
                <Link href={`/events-manager/dashboard/${event.id}`} passHref>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4 flex items-center justify-center">
                    View RSVPs <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventsManagerDashboard;
