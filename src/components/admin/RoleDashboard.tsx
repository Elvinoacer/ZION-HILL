"use client";
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

import { motion } from "framer-motion";
import { RoleName } from "@/generated/prisma"; // Import RoleName
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";
import RecentTasks from "./RecentTasks";
import MinistryOverview from "./MinistryOverview"; // This will need to be conditional or removed
import { useAdminStore } from "@/store";
import { useEffect } from "react";

// Import specific dashboard components for each role
import { WorshipLeaderDashboard } from "./worship-leader/WorshipLeaderDashboard"; // Example
import { MinistriesCoordinatorDashboard } from "../admin-ministries/MinistriesCoordinatorDashboard"; // Example
import { OutreachDirectorDashboard } from "../aoutreach/OutreachDirectorDashboard"; // Example
import { DiscipleshipLeaderDashboard } from "../discipleship/DiscipleshipLeaderDashboard"; // Example
import { EventsManagerDashboard } from "../events/EventsManagerDashboard"; // Example
import { CounselingCoordinatorDashboard } from "../pastoralcare/CounselingCoordinatorDashboard"; // Example
import { TechMediaManagerDashboard } from "../digitalhub/TechMediaManagerDashboard"; // Example
import { FinanceAdministratorDashboard } from "../churchadmindashboard/FinanceAdministratorDashboard"; // Example
import { VolunteerCoordinatorDashboard } from "../volunteer/VolunteerCoordinatorDashboard"; // Example
import { SmallGroupsLeaderDashboard } from "../discipleship/SmallGroupsLeaderDashboard"; // Example
import { ChildrenYouthDirectorDashboard } from "../DiscipleshipSafetyHubDashboard/ChildrenYouthDirectorDashboard"; // Example
import { SecretaryDashboard } from "../command-center/SecretaryDashboard"; // Example
import { CommunicationsOfficerDashboard } from "../BrandEngagementHubDashboard/CommunicationsOfficerDashboard"; // Example
import { SeniorPastorDashboard } from "../senior-pastor/SeniorPastorDashboard"; // Example
import { MissionsPastorDashboard } from "../mission-outreach-dash/MissionsPastorDashboard"; // Example

export default function RoleDashboard({ roleName }: { roleName: RoleName }) {
  // Changed prop
  const { tasks, activityLogs, fetchTasks, fetchActivityLogs } =
    useAdminStore();

  useEffect(() => {
    fetchTasks();
    fetchActivityLogs();
  }, [fetchTasks, fetchActivityLogs]);

  // Conditional rendering based on roleName
  const renderDashboardContent = () => {
    switch (roleName) {
      case RoleName.ADMIN:
        return (
          <>
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Overview of the entire system.
              </p>
            </motion.div>
            {/* General Admin Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <StatsCard
                title="Total Users"
                value="1,234"
                change="+5%"
                gradient="from-purple-500 to-purple-600"
              />
              <StatsCard
                title="Active Events"
                value="42"
                change="+2"
                gradient="from-blue-500 to-blue-600"
              />
              <StatsCard
                title="Total Ministries"
                value="15"
                change="+1"
                gradient="from-green-500 to-green-600"
              />
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 space-y-6"
              >
                {/* Admin specific content */}
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6">
                <RecentTasks tasks={tasks} />
                <ActivityFeed activityLogs={activityLogs} />
              </motion.div>
            </div>
          </>
        );
      case RoleName.MEMBER:
        return (
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-800">
              Member Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your personalized dashboard.
            </p>
            {/* Member specific content */}
          </motion.div>
        );
      case RoleName.GUEST:
        return (
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-800">Guest View</h1>
            <p className="text-gray-600 mt-2">
              Explore our church&apos;s public information.
            </p>
            {/* Guest specific content */}
          </motion.div>
        );
      case RoleName.WORSHIP_LEADER:
        return <WorshipLeaderDashboard />; // Placeholder
      case RoleName.OVERALL_MINISTRIES_COORDINATOR:
        return <MinistriesCoordinatorDashboard />; // Placeholder
      case RoleName.MEN_MINISTRY_COORDINATOR:
      case RoleName.WOMEN_MINISTRY_COORDINATOR:
      case RoleName.YOUTH_MINISTRY_COORDINATOR:
      case RoleName.COUPLES_AND_FAMILY_MINISTRY_COORDINATOR:
      case RoleName.CHILDREN_MINISTRY_COORDINATOR:
      case RoleName.YOUNG_ADULTS_MINISTRY_COORDINATOR:
      case RoleName.ELDERS_MINISTRY_COORDINATOR:
      case RoleName.SINGLES_MINISTRY_COORDINATOR:
        return <MinistriesCoordinatorDashboard roleName={roleName} />; // Placeholder, pass roleName
      case RoleName.OUTREACH_DIRECTOR:
        return <OutreachDirectorDashboard />; // Placeholder
      case RoleName.DISCIPLESHIP_LEADER:
        return <DiscipleshipLeaderDashboard />; // Placeholder
      case RoleName.EVENTS_MANAGER:
        return <EventsManagerDashboard />; // Placeholder
      case RoleName.COUNSELOR:
        return <CounselingCoordinatorDashboard />; // Placeholder
      case RoleName.TECH_MEDIA_MANAGER:
        return <TechMediaManagerDashboard />; // Placeholder
      case RoleName.FINANCE_ADMINISTRATOR:
        return <FinanceAdministratorDashboard />; // Placeholder
      case RoleName.VOLUNTEER_COORDINATOR:
        return <VolunteerCoordinatorDashboard />; // Placeholder
      case RoleName.SMALL_GROUPS_LEADER:
        return <SmallGroupsLeaderDashboard />; // Placeholder
      case RoleName.CHILDREN_YOUTH_DIRECTOR:
        return <ChildrenYouthDirectorDashboard />; // Placeholder
      case RoleName.SECRETARY:
        return <SecretaryDashboard />; // Placeholder
      case RoleName.COMMUNICATIONS_OFFICER:
        return <CommunicationsOfficerDashboard />; // Placeholder
      case RoleName.SENIOR_PASTOR:
        return <SeniorPastorDashboard />; // Placeholder
      case RoleName.MISSIONS_PASTOR:
        return <MissionsPastorDashboard />; // Placeholder
      default:
        return (
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-800">Unknown Role</h1>
            <p className="text-gray-600 mt-2">
              No specific dashboard configured for this role.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {renderDashboardContent()}
    </motion.div>
  );
}
