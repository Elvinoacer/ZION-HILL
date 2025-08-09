import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Event } from "@/generated/prisma";
import { useEventStore } from "@/store";

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const { rsvpToEvent } = useEventStore();
  // Placeholder for userId - in a real app, this would come from auth context
  const userId = "cmdyug60e0000rqhot5b47ii0"; // Replace with actual user ID

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const handleRsvpClick = async (eventId: string) => {
    if (userId) {
      await rsvpToEvent(eventId, userId);
      alert("RSVP successful!");
    } else {
      alert("Please log in to RSVP.");
    }
  };

  const handleDetailsClick = (eventId: string) => {
    console.log(`View details for event: ${eventId}`);
    // Implement navigation to event details page
  };

  const handleViewAllEventsClick = () => {
    console.log("View all events");
    // Implement navigation to all events page
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold mb-5 flex items-center text-gray-800">
        <CalendarDays className="mr-2 text-blue-600" /> Upcoming Events
      </h3>
      <div className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No upcoming events found.
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -2 }}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all bg-white"
            >
              <div className="font-semibold text-gray-800">{event.title}</div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                {new Date(event.date).toLocaleDateString()} •{" "}
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                {event.location}
              </div>
              <div className="mt-3">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {event.ministryId || "General"}
                </span>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleRsvpClick(event.id)}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  RSVP
                </button>
                <button
                  onClick={() => handleDetailsClick(event.id)}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Details
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      <button
        onClick={handleViewAllEventsClick}
        className="mt-5 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center"
      >
        View All Events
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </motion.div>
  );
}
