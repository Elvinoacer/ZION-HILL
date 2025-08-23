import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Event } from "@/generated/prisma";

interface MissionTripsProps {
  itineraries: Event[];
}

export default function MissionTrips({ itineraries }: MissionTripsProps) {
  const handleAddItinerary = () => {
    console.log("Adding new itinerary to /api/itineraries");
    // In a real app, you would call a Zustand action here to create a new itinerary
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Mission Trip Itineraries
      </h2>
      <motion.button
        onClick={handleAddItinerary}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        whileHover={{ scale: 1.03 }}
        aria-label="Add new itinerary"
      >
        Add New Itinerary
      </motion.button>
      <div className="space-y-4">
        {itineraries.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No mission trips found.
          </div>
        ) : (
          itineraries.map((itinerary, index) => (
            <motion.div
              key={itinerary.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {itinerary.title}
                  </div>
                  <div className="text-sm text-gray-600 text-wrap">
                    {itinerary.location} |{" "}
                    {new Date(itinerary.date).toLocaleDateString()} -{" "}
                    {new Date(
                      itinerary.endDate || itinerary.date
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 text-wrap">
                    Tasks: {itinerary.description}{" "}
                    {/* Assuming description can be used for tasks */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
