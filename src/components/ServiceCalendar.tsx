import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { useState } from "react";
import { Event } from "@/generated/prisma";
import { useEventStore } from "@/store";

interface ServiceCalendarProps {
  events: Event[];
}

export default function ServiceCalendar({ events }: ServiceCalendarProps) {
  const { rsvpToEvent, fetchEvents } = useEventStore();
  // Placeholder for userId - in a real app, this would come from auth context
  const userId = "cmdyug60e0000rqhot5b47ii0"; // Replace with actual user ID

  const handleRSVP = async (id: string, response: boolean) => {
    try {
      if (response) {
        await rsvpToEvent(id, userId);
        alert("RSVP successful!");
      } else {
        // Implement decline functionality if needed
        alert("Declined RSVP.");
      }
      fetchEvents(); // Re-fetch events to update UI
    } catch (error) {
      console.error("RSVP Error:", error);
      alert("RSVP failed.");
    }
  };

  const serviceEvents = events.filter(event => event.type === "SERVICE");

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="service-calendar-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          id="service-calendar-heading"
          className="text-xl font-semibold flex items-center text-gray-800"
        >
          <CalendarIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Service
          Calendar
        </h3>
        <button
          onClick={() => console.log("View Full Calendar clicked")}
          className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          aria-label="View full service calendar"
        >
          View Full Calendar →
        </button>
      </div>

      <ul className="space-y-4" role="list">
        {serviceEvents.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No services found.
          </div>
        )}
        {serviceEvents.map((event) => (
          <motion.li
            key={event.id}
            whileHover={{
              scale: 1.02,
              y: -5,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border border-gray-200 rounded-lg p-4 bg-white"
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                console.log(`Selected ${event.title}`);
              }
            }}
            aria-labelledby={`event-title-${event.id}`}
          >
            <div
              id={`event-title-${event.id}`}
              className="font-semibold text-lg mb-2 text-gray-800"
            >
              {event.title}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
                {event.time}
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                {event.location}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleRSVP(event.id, true)}
                className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 ${
                  event.rsvp === true
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                aria-label={`Confirm attendance for ${event.title}`}
              >
                <Check className="mr-1 h-4 w-4" aria-hidden="true" /> Attend
              </button>

              <button
                onClick={() => handleRSVP(event.id, false)}
                className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 ${
                  event.rsvp === false
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                aria-label={`Decline attendance for ${event.title}`}
              >
                <X className="mr-1 h-4 w-4" aria-hidden="true" /> Decline
              </button>
            </div>

            {event.rsvp !== null && (
              <div className="mt-2 text-sm text-gray-600">
                You&apos;ve {event.rsvp ? "confirmed" : "declined"} attendance
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
