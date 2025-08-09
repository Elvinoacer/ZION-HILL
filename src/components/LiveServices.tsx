import { motion } from "framer-motion";
import { Play, Users, Clock, Calendar } from "lucide-react";
import { Event } from "@prisma/client";

interface LiveServicesProps {
  services: Event[];
}

export default function LiveServices({ services }: LiveServicesProps) {
  const liveService = services.find(service => service.live); // Assuming a 'live' property on Event

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="live-services-heading"
    >
      <h3
        id="live-services-heading"
        className="text-xl font-semibold mb-6 text-gray-800"
      >
        Live Services
      </h3>

      {liveService ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <span
                  className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"
                  aria-hidden="true"
                ></span>
                <span className="text-red-600 font-medium">LIVE NOW</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                {liveService.title}
              </h4>
            </div>
            <button
              className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              aria-label="Join the live Sunday Morning Worship service"
            >
              <Play className="mr-2 h-4 w-4" aria-hidden="true" /> Join Now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Clock
                className="h-5 w-5 text-gray-500 mr-3"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-medium text-gray-800">
                  {liveService.time}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar
                className="h-5 w-5 text-gray-500 mr-3"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-medium text-gray-800">
                  {new Date(liveService.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Users
                className="h-5 w-5 text-gray-500 mr-3"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm text-gray-600">Attendance</div>
                <div className="font-medium text-gray-800">
                  {liveService.attendees || 0} / {liveService.capacity || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h5 className="font-semibold mb-3 text-gray-800">
              Service Materials
            </h5>
            <div className="flex space-x-3">
              <button
                className="border border-gray-300 px-3 py-1 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="View Order of Service"
              >
                Order of Service
              </button>
              <button
                className="border border-gray-300 px-3 py-1 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="View Sermon Notes"
              >
                Sermon Notes
              </button>
              <button
                className="border border-gray-300 px-3 py-1 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="View Song Lyrics"
              >
                Song Lyrics
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-600 mb-2">
            No live service at the moment
          </div>
          <div className="text-sm text-gray-500">
            Next service: Sunday at 9:00 AM
          </div>
        </div>
      )}
    </motion.div>
  );
}
