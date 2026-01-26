import { useState } from "react";
import { motion } from "framer-motion";
import { Book, AlertTriangle } from "lucide-react";
import { useDrop, useDrag } from "react-dnd";
import { Lesson, User } from "@/generated/prisma";

interface MinistryProgramManagementProps {
  lessons: Lesson[];
}

type Activity = {
  id: number;
  type: string;
  duration: number;
  linkedVerse?: string;
};

export default function MinistryProgramManagement({ lessons }: MinistryProgramManagementProps) {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, type: "Game", duration: 15, linkedVerse: "Psalm 119:9" },
    { id: 2, type: "Small Group", duration: 30 },
  ]);

  const [children, setChildren] = useState<any[]>([
    {
      id: 1,
      name: "John Smith",
      medicalNotes: "Peanut allergy",
      pickupContacts: ["Mom: 555-1234", "Grandpa: 555-5678"],
      checkedIn: false,
    },
  ]);

  const [, drop] = useDrop({
    accept: "ACTIVITY",
    drop: (item: { id: number; type: string; duration: number }) => {
      setActivities((prev) => [...prev, { ...item, id: prev.length + 1 }]);
    },
  });

  const handleCheckIn = (id: number) => {
    console.log(`Checking in child ${id} with QR code`);
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checkedIn: true } : c))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Ministry Program Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Age-Specific Curriculum Builder
          </h3>
          <div className="flex space-x-6 mt-4">
            <div className="w-1/3">
              <h4 className="text-md font-semibold text-gray-900">
                Available Activities
              </h4>
              <div className="mt-2">
                <DraggableActivity id={3} type="Craft" duration={20} />
                <DraggableActivity
                  id={4}
                  type="Story"
                  duration={25}
                  linkedVerse="John 3:16"
                />
              </div>
            </div>
            <div
              ref={drop}
              className="w-2/3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
            >
              <h4 className="text-md font-semibold text-gray-900">
                Lesson Planner (Ages 10-12, 90 min)
              </h4>
              <div className="mt-2 space-y-2">
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
                      className="p-3 bg-white rounded-lg shadow-sm flex items-center"
                    >
                      <Book className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {lesson.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {lesson.duration || "N/A"} min | Verse:{" "}
                          {lesson.linkedVerse || "None"}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Digital Check-In System
          </h3>
          <div className="mt-4 space-y-2">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {child.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Medical: {child.medicalNotes || "None"}
                    {child.medicalNotes && (
                      <span className="text-red-600 ml-2">
                        Anomaly <AlertTriangle className="h-4 w-4 inline" />
                      </span>
                    )}
                    | Pickup: {child.pickupContacts.join(", ")} | Status:{" "}
                    {child.checkedIn ? "Checked In" : "Pending"}
                  </div>
                  {!child.checkedIn && (
                    <motion.button
                      onClick={() => handleCheckIn(child.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Check in ${child.name}`}
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

function DraggableActivity({ id, type, duration, linkedVerse }: Activity) {
  const [{ isDragging }, drag] = useDrag({
    type: "ACTIVITY",
    item: { id, type, duration, linkedVerse },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded-lg shadow-sm flex items-center cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <Book className="h-5 w-5 text-blue-600 mr-2" />
      <span>
        {type} ({duration} min)
      </span>
    </div>
  );
}

