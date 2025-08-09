import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useEventStore } from "@/store";

interface MinistryEventsProps {
  ministryId: string;
}

export default function MinistryEvents({ ministryId }: MinistryEventsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { events, loading, error, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents(); // Fetch all events, then filter by ministryId locally
  }, [fetchEvents]);

  const ministryEvents = events.filter(event => event.ministryId === ministryId);

  const upcomingEvents = ministryEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = ministryEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  const displayedEvents = {
    upcoming: upcomingEvents,
    past: pastEvents,
  };

  if (loading) return <div className="text-center py-8">Loading ministry events...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

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
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
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
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              activeTab === "past"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
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
        id={activeTab === "upcoming" ? "upcoming-events" : "past-events"}
        role="tabpanel"
        aria-labelledby={activeTab === "upcoming" ? "upcoming-tab" : "past-tab"}
        className="space-y-4"
      >
        {displayedEvents[activeTab].length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No {activeTab} events found.
          </div>
        ) : (
          displayedEvents[activeTab].map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -2 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              role="article"
              aria-labelledby={`event-title-${event.id}`}
            >
              <div
                id={`event-title-${event.id}`}
                className="font-semibold text-lg mb-2 text-gray-800"
              >
                {event.title}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
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

              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="mr-2 h-4 w-4" aria-hidden="true" />
                  {/* Assuming leader and attendees are available on the event object */}
                  Led by {event.leaderId || "N/A"} • {event.attendees || 0} attending
                </div>

                <div className="flex space-x-2">
                  {activeTab === "upcoming" && (
                    <>
                      <button
                        className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded hover:from-blue-600 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label={`RSVP to ${event.title}`}
                      >
                        RSVP
                      </button>
                      <button
                        className="text-xs text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label={`View details for ${event.title}`}
                      >
                        Details
                      </button>
                    </>
                  )}
                  {activeTab === "past" && (
                    <button
                      className="text-xs border text-black border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      aria-label={`View report for ${event.title}`}
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <button
        className="mt-4 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label={
          activeTab === "upcoming" ? "Create new event" : "View all past events"
        }
      >
        {activeTab === "upcoming" ? "Create New Event" : "View All Past Events"}{" "}
        →
      </button>
    </motion.div>
  );
}
