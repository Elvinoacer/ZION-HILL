import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { User } from "@/generated/prisma";

interface VolunteerCoordinationProps {
  volunteers: User[];
}

export default function VolunteerCoordination({ volunteers }: VolunteerCoordinationProps) {
  const [trainings, setTrainings] = useState([
    { id: 1, title: "Baby Nursery 101", completed: false },
  ]);

  const handleCheckClearance = (id: string) => {
    console.log(
      `Checking clearance status for volunteer ${id} via Protect My Ministry`
    );
    // In a real app, you would call a Zustand action here to check clearance
  };

  const handleCompleteTraining = (id: number) => {
    console.log(`Completing training ${id}`);
    setTrainings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Volunteer Coordination
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Background-Compliant Teams
          </h3>
          <div className="mt-4 space-y-2">
            {volunteers.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No volunteers found.
              </div>
            ) : (
              volunteers.map((volunteer, index) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {volunteer.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {/* Assuming requirements are part of the User model or can be derived */}
                      Requirements: N/A
                      {/* {volunteer.requirements.some(
                        (r) => new Date(r.expires) < new Date()
                      ) && (
                        <span className="text-red-600 ml-2">
                          Expired <AlertTriangle className="h-4 w-4 inline" />
                        </span>
                      )} */}
                    </div>
                    <motion.button
                      onClick={() => handleCheckClearance(volunteer.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Check clearance for ${volunteer.name}`}
                    >
                      Check Clearance
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Role-Specific Training
          </h3>
          <div className="mt-4 space-y-2">
            {trainings.map((training, index) => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {training.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {training.completed ? "Completed" : "Pending"}
                  </div>
                  {!training.completed && (
                    <motion.button
                      onClick={() => handleCompleteTraining(training.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Complete ${training.title}`}
                    >
                      Complete Training
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
