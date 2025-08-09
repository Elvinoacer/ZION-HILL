import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Lesson } from "@prisma/client";

interface FamilyEngagementProps {
  lessons: Lesson[];
}

type Milestone = {
  id: number;
  child: string;
  type: string;
  date: string;
};

export default function FamilyEngagement({ lessons }: FamilyEngagementProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, child: "John Smith", type: "First Bible", date: "2025-08-04" },
    {
      id: 2,
      child: "Sarah Lee",
      type: "Baptism Anniversary",
      date: "2024-08-04",
    },
  ]);

  const handleSendParentEmail = (id: string) => {
    console.log(`Sending parent email for lesson ${id} via Remind/Band`);
  };

  const handleCelebrateMilestone = (id: number) => {
    console.log(`Celebrating milestone ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Family Engagement
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Parent Partnership Tools
          </h3>
          <div className="mt-4 space-y-2">
            {lessons.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No lessons found.
              </div>
            ) : (
              lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Heart className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {lesson.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {/* Assuming parentEmailTemplate is a field on Lesson */}
                      Email Template: {lesson.parentEmailTemplate || "N/A"}
                    </div>
                    <motion.button
                      onClick={() => handleSendParentEmail(lesson.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Send parent email for ${lesson.title}`}
                    >
                      Send to Parents
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Milestone Celebrations
          </h3>
          <div className="mt-4 space-y-2">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Heart className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {milestone.child}
                  </div>
                  <div className="text-sm text-gray-600">
                    {milestone.type} ({milestone.date})
                  </div>
                  <motion.button
                    onClick={() => handleCelebrateMilestone(milestone.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Celebrate ${milestone.type} for ${milestone.child}`}
                  >
                    Celebrate
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
