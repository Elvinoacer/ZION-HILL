import { motion } from "framer-motion";
import { Calendar, AlertTriangle } from "lucide-react";
import { Event } from "@/generated/prisma";

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Event Calendar
      </h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No events found.
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm flex items-center"
            >
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">{event.title}</div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(event.date).toLocaleDateString()} | Venue: {event.location} | Equipment:{" "}
                  {/* Assuming equipment is part of the event object or can be derived */}
                  N/A
                </div>
                {/* Assuming conflicts are part of the event object or can be derived */}
                {/* {event?.conflicts?.length && event?.conflicts?.length > 0 && (
                  <div className="text-sm text-red-600">
                    Conflicts: {event?.conflicts?.join(", ")}{" "}
                    <AlertTriangle className="h-4 w-4 inline ml-1" />
                  </div>
                )} */}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
