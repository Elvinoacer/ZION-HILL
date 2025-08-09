import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, QrCode } from "lucide-react";

type VolunteerShift = {
  id: number;
  volunteer: string;
  eventId: number;
  time: string;
  conflictCheck: boolean;
  replacementPool: string[];
  checkedIn: boolean;
};

export default function SchedulingDeployment() {
  const [shifts, setShifts] = useState<VolunteerShift[]>([
    {
      id: 1,
      volunteer: "John Doe",
      eventId: 101,
      time: "Sun 9am",
      conflictCheck: false,
      replacementPool: ["Jane Smith", "Bob Johnson"],
      checkedIn: false,
    },
  ]);

  const handleScheduleShift = () => {
    console.log("Scheduling shift with conflict-free check");
    setShifts([
      ...shifts,
      {
        id: shifts.length + 1,
        volunteer: "New Volunteer",
        eventId: 102,
        time: "Sun 11am",
        conflictCheck: true,
        replacementPool: ["Jane Smith"],
        checkedIn: false,
      },
    ]);
  };

  const handleCheckIn = (id: number) => {
    console.log(`Checking in volunteer for shift ${id} via QR code`);
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checkedIn: true } : s))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Scheduling & Deployment
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Intelligent Shift Management
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <motion.button
              onClick={handleScheduleShift}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Schedule New Shift"
            >
              Schedule Shift
            </motion.button>
            <div className="mt-4 space-y-2">
              {shifts.map((shift, index) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {shift.volunteer} - {shift.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      Event ID: {shift.eventId} | Conflict Check:{" "}
                      {shift.conflictCheck ? "Passed" : "Pending"}|
                      Replacements: {shift.replacementPool.join(", ")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Mobile Check-In System
          </h3>
          <div className="mt-4 space-y-2">
            {shifts.map((shift, index) => (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <QrCode className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {shift.volunteer} - {shift.time}
                  </div>
                  <div className="text-sm text-gray-600">
                    Check-In: {shift.checkedIn ? "Completed" : "Pending"}
                  </div>
                  {!shift.checkedIn && (
                    <motion.button
                      onClick={() => handleCheckIn(shift.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Check in for shift ${shift.id}`}
                    >
                      Check In
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
