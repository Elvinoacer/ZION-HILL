"use client";

import { motion } from "framer-motion";
import { Ministry } from "@/generated/prisma";
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";
import RecentTasks from "./RecentTasks";
import MinistryOverview from "./MinistryOverview";
import { useAdminStore } from "@/store";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function RoleDashboard({ ministry }: { ministry: Ministry }) {
  const { tasks, activityLogs, fetchTasks, fetchActivityLogs } =
    useAdminStore();

  useEffect(() => {
    fetchTasks();
    fetchActivityLogs();
  }, [fetchTasks, fetchActivityLogs]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-2xl">
            {ministry?.id + "supposed to be an icon"}
          </span>
          {ministry?.name} Dashboard
        </h1>
        <p className="text-gray-600 mt-2">{ministry?.description}</p>
      </motion.div>

      {/* Role-specific Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatsCard
          title="Active Members"
          value={ministry?.membersCount?.toString() || "N/A"}
          change="+8%"
          gradient="from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Upcoming Events"
          value={ministry?.upcomingEvents?.toString() || "N/A"}
          change="+2"
          gradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Volunteers"
          value={ministry?.volunteersCount?.toString() || "N/A"}
          change="+3"
          gradient="from-green-500 to-green-600"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <MinistryOverview ministry={ministry} />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <RecentTasks tasks={tasks} />
          <ActivityFeed activityLogs={activityLogs} />
        </motion.div>
      </div>
    </motion.div>
  );
}
