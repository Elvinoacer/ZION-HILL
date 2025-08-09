import { motion } from "framer-motion";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

type Event = {
  id: number;
  title: string;
  ministry: string;
  calendarColor: string;
  date: string;
  conflicts?: string[];
};

type Room = {
  id: number;
  name: string;
  bookings: number;
};

export default function CalendarScheduling() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Wedding",
      ministry: "Events",
      calendarColor: "#9333EA",
      date: "2025-08-10",
      conflicts: [],
    },
    {
      id: 2,
      title: "Youth Service",
      ministry: "Youth",
      calendarColor: "#4F46E5",
      date: "2025-08-11",
    },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "Sanctuary", bookings: 5 },
    { id: 2, name: "Fellowship Hall", bookings: 3 },
  ]);

  const chartData = rooms.map((room) => ({
    name: room.name,
    Bookings: room.bookings,
  }));

  const handleResolveConflict = (id: number) => {
    console.log(`Resolving conflict for event ${id}`);
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, conflicts: [] } : e))
    );
  };

  const handleBookRoom = () => {
    console.log("Booking room");
    setRooms((prev) => [
      ...prev,
      { id: prev.length + 1, name: "New Room", bookings: 1 },
    ]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Calendar & Scheduling
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Master Calendar Oversight
          </h3>
          <div className="mt-4 space-y-2">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: event.calendarColor }}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Ministry: {event.ministry} | Date: {event.date}
                    {event.conflicts?.length > 0 && (
                      <span className="text-red-600 ml-2">
                        Conflict Detected
                      </span>
                    )}
                  </div>
                  {event.conflicts?.length > 0 && (
                    <motion.button
                      onClick={() => handleResolveConflict(event.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Resolve conflict for ${event.title}`}
                    >
                      Resolve Conflict
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Facility Booking System
          </h3>
          <div className="mt-4">
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Bookings" fill="#2563eb" />
            </BarChart>
            <motion.button
              onClick={handleBookRoom}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Book new room"
            >
              Book Room
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
