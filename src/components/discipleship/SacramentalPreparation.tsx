import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

type Candidate = {
  id: number;
  name: string;
  applicationStatus: "Pending" | "In Progress" | "Completed";
  classCompletion: number;
};

export default function SacramentalPreparation() {
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "John Smith",
      applicationStatus: "In Progress",
      classCompletion: 75,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      applicationStatus: "Pending",
      classCompletion: 0,
    },
  ];

  const communionSchedule = [
    { id: 1, date: "2023-12-01", time: "10:00 AM", participants: 20 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Sacramental Preparation
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Baptism Pipeline
          </h3>
          <div className="mt-4 space-y-2">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {candidate.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {candidate.applicationStatus} | Completion:{" "}
                    {candidate.classCompletion}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Communion Schedule
          </h3>
          <div className="mt-4 space-y-2">
            {communionSchedule.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {event.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    Time: {event.time} | Participants: {event.participants}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
