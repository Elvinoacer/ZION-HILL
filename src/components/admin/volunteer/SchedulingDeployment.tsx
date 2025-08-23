import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  QrCode,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Scan,
} from "lucide-react";

type VolunteerShift = {
  id: number;
  volunteer: string;
  eventId: number;
  eventName: string;
  time: string;
  date: string;
  conflictCheck: boolean;
  replacementPool: string[];
  checkedIn: boolean;
  location: string;
};

export default function SchedulingDeployment() {
  const [shifts, setShifts] = useState<VolunteerShift[]>([
    {
      id: 1,
      volunteer: "John Doe",
      eventId: 101,
      eventName: "Sunday Service",
      time: "9:00 AM - 11:00 AM",
      date: "Sun, Dec 12",
      conflictCheck: true,
      replacementPool: ["Jane Smith", "Bob Johnson"],
      checkedIn: false,
      location: "Main Sanctuary",
    },
    {
      id: 2,
      volunteer: "Sarah Wilson",
      eventId: 102,
      eventName: "Youth Group",
      time: "6:00 PM - 8:00 PM",
      date: "Wed, Dec 15",
      conflictCheck: false,
      replacementPool: ["Mike Brown"],
      checkedIn: true,
      location: "Youth Hall",
    },
    {
      id: 3,
      volunteer: "Alex Johnson",
      eventId: 103,
      eventName: "Food Bank",
      time: "10:00 AM - 2:00 PM",
      date: "Sat, Dec 18",
      conflictCheck: true,
      replacementPool: ["Emma Davis", "James Wilson"],
      checkedIn: false,
      location: "Community Center",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"shifts" | "checkins">("shifts");

  const handleScheduleShift = () => {
    console.log("Scheduling shift with conflict-free check");
    setShifts([
      ...shifts,
      {
        id: shifts.length + 1,
        volunteer: "New Volunteer",
        eventId: 104,
        eventName: "Evening Service",
        time: "6:00 PM - 8:00 PM",
        date: "Sun, Dec 12",
        conflictCheck: true,
        replacementPool: ["Jane Smith"],
        checkedIn: false,
        location: "Main Sanctuary",
      },
    ]);
  };

  const handleCheckIn = (id: number) => {
    console.log(`Checking in volunteer for shift ${id} via QR code`);
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checkedIn: true } : s))
    );
  };

  const pendingShifts = shifts.filter((shift) => !shift.checkedIn);
  const completedCheckins = shifts.filter((shift) => shift.checkedIn);

  return (
    <div className="text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Scheduling & Deployment
        </h2>

        {/* Tab Navigation */}
        <div className="flex bg-gray-700 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("shifts")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "shifts"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Shift Management
          </button>
          <button
            onClick={() => setActiveTab("checkins")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "checkins"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Check-In System
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Intelligent Shift Management */}
        {activeTab === "shifts" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Intelligent Shift Management
            </h3>

            <motion.button
              onClick={handleScheduleShift}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all mb-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Schedule New Shift"
            >
              <Plus className="h-4 w-4" />
              Schedule New Shift
            </motion.button>

            <div className="mt-4 space-y-3">
              {shifts.map((shift, index) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="bg-blue-900/30 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <div className="font-semibold text-white">
                            {shift.volunteer}
                          </div>
                          <div className="text-sm text-blue-300 font-medium">
                            {shift.eventName}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              shift.conflictCheck
                                ? "bg-green-900/30 text-green-300"
                                : "bg-yellow-900/30 text-yellow-300"
                            }`}
                          >
                            {shift.conflictCheck ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                No Conflicts
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Check Conflicts
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                          <span>
                            {shift.date} • {shift.time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1.5">📍</span>
                          <span>{shift.location}</span>
                        </div>
                      </div>

                      {shift.replacementPool.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-400 mb-1">
                            Available Replacements:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {shift.replacementPool.map((person, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-600/50 text-xs rounded-full text-gray-300"
                              >
                                {person}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Check-In System */}
        {activeTab === "checkins" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-400" />
              Mobile Check-In System
            </h3>

            {/* Pending Check-Ins */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                Pending Check-Ins ({pendingShifts.length})
              </h4>

              {pendingShifts.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>All volunteers are checked in!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingShifts.map((shift, index) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="bg-purple-900/30 p-2 rounded-lg">
                          <QrCode className="h-5 w-5 text-purple-400" />
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">
                            {shift.volunteer}
                          </div>
                          <div className="text-sm text-blue-300 font-medium mb-2">
                            {shift.eventName}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                              <span>
                                {shift.date} • {shift.time}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1.5">📍</span>
                              <span>{shift.location}</span>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => handleCheckIn(shift.id)}
                            className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Check in ${shift.volunteer}`}
                          >
                            <Scan className="h-4 w-4" />
                            Check In via QR
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Check-Ins */}
            <div>
              <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Completed Check-Ins ({completedCheckins.length})
              </h4>

              {completedCheckins.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  <p>No check-ins completed yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedCheckins.map((shift, index) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gray-700/30 rounded-lg border border-green-600/30"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {shift.volunteer}
                          </div>
                          <div className="text-sm text-green-300">
                            Checked in for {shift.eventName}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {shift.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
