// components/MinistryUpdates.tsx
import { motion } from "framer-motion";
import { Megaphone, Users, BookOpen } from "lucide-react";
import { Ministry } from "@/generated/prisma";

interface MinistryUpdatesProps {
  ministries: Ministry[];
}

export default function MinistryUpdates({ ministries }: MinistryUpdatesProps) {
  // For simplicity, let's generate some mock updates based on ministries
  const updates = ministries.map((ministry) => ({
    id: ministry.id,
    type: "Announcement",
    title: `${ministry.name} Update`,
    content: ministry.description,
    date: new Date(ministry.createdAt).toLocaleDateString(),
    icon: <Megaphone className="h-5 w-5 text-blue-600" />,
  }));

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold mb-5 text-gray-800">Ministry Updates</h3>
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No ministry updates found.
          </div>
        ) : (
          updates.map((update) => (
            <motion.div
              key={update.id}
              whileHover={{ x: 3 }}
              className="border-l-4 border-blue-100 pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5 p-1.5 rounded-lg bg-opacity-20 bg-blue-100">
                  {update.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {update.type}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {update.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{update.content}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {update.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      <button
        onClick={() => console.log("See All Ministry Updates")}
        className="mt-5 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center"
      >
        See All Updates
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </motion.div>
  );
}
