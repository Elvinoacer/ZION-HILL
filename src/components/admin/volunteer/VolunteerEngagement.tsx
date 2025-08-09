import { useState } from "react";
import { motion } from "framer-motion";
import { Award, AlertTriangle } from "lucide-react";

type Volunteer = {
  id: number;
  name: string;
  hours: number;
  riskAlert: boolean;
};

export default function VolunteerEngagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: 1, name: "John Doe", hours: 100, riskAlert: false },
    { id: 2, name: "Jane Smith", hours: 45, riskAlert: true },
  ]);

  const handleAwardBadge = (id: number) => {
    console.log(`Awarding badge to volunteer ${id}`);
  };

  const handleAnalyzeFeedback = (id: number) => {
    console.log(
      `Analyzing feedback for volunteer ${id} with AI sentiment analysis`
    );
  };

  const milestones = [50, 100, 500];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Volunteer Engagement
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Appreciation Tools
          </h3>
          <div className="mt-4 space-y-2">
            {volunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {volunteer.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Hours: {volunteer.hours} | Milestones:{" "}
                    {milestones.filter((m) => volunteer.hours >= m).join(", ")}
                  </div>
                  <motion.button
                    onClick={() => handleAwardBadge(volunteer.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Award badge to ${volunteer.name}`}
                  >
                    Award Badge
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Feedback Collection
          </h3>
          <div className="mt-4 space-y-2">
            {volunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {volunteer.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {volunteer.riskAlert && (
                      <span className="text-red-600">
                        Retention Risk{" "}
                        <AlertTriangle className="h-4 w-4 inline" />
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => handleAnalyzeFeedback(volunteer.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Analyze feedback for ${volunteer.name}`}
                  >
                    Analyze Feedback
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
