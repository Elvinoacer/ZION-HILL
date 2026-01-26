"use client";

import { motion } from "framer-motion";
import { AuditLog } from "@/generated/prisma";

interface ActivityFeedProps {
  activityLogs: AuditLog[];
}

export default function ActivityFeed({ activityLogs }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {activityLogs.length > 0 ? (
          activityLogs.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.type === "EVENT"
                      ? "bg-purple-100 text-purple-600"
                      : activity.type === "MEETING"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {activity.type === "EVENT"
                    ? "🎉"
                    : activity.type === "MEETING"
                    ? "📅"
                    : "🤝"}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()} •{" "}
                    {activity.userId}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No recent activity.
          </div>
        )}
      </div>
    </motion.div>
  );
}
