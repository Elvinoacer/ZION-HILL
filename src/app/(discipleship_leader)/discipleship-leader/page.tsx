"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  BookOpen,
  ChartBar,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
  Bell,
} from "lucide-react";
import { FaPray, FaChurch, FaHandsHelping } from "react-icons/fa";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CurriculumBuilder from "@/components/discipleship/CurriculumBuilder";
import ProgressTracking from "@/components/discipleship/ProgressTracking";
import SmallGroupOversight from "@/components/discipleship/SmallGroupOversight";
import SacramentalPreparation from "@/components/discipleship/SacramentalPreparation";
import SeasonalPlanning from "@/components/discipleship/SeasonalPlanning";

const theme = {
  primary: "bg-blue-600 dark:bg-blue-700",
  primaryHover: "hover:bg-blue-700 dark:hover:bg-blue-800",
  secondary: "bg-gray-200 dark:bg-gray-700",
  secondaryHover: "hover:bg-gray-300 dark:hover:bg-gray-600",
  textPrimary: "text-gray-900 dark:text-gray-100",
  textSecondary: "text-gray-600 dark:text-gray-300",
  accentBlue: "bg-blue-100 dark:bg-blue-900/30",
  accentGreen: "bg-green-100 dark:bg-green-900/30",
  accentPurple: "bg-purple-100 dark:bg-purple-900/30",
};

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("discipleship");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setShowMobileSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sections = [
    { id: "discipleship", label: "Discipleship Management", icon: Users },
    { id: "curriculum", label: "Curriculum Builder", icon: BookOpen },
    { id: "progress", label: "Progress Tracking", icon: ChartBar },
    { id: "groups", label: "Small Groups", icon: Users },
    { id: "sacramental", label: "Sacramental Preparation", icon: FaChurch },
    { id: "seasonal", label: "Seasonal Planning", icon: Calendar },
    { id: "prayer", label: "Prayer Ministry", icon: FaPray },
    { id: "outreach", label: "Outreach Programs", icon: FaHandsHelping },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Mobile Sidebar Toggle */}
        {isMobile && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-blue-600 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 md:hidden"
            aria-label={showMobileSidebar ? "Close sidebar" : "Open sidebar"}
          >
            {showMobileSidebar ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>
        )}

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobile && showMobileSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isMobile && !showMobileSidebar
              ? "-translate-x-full"
              : "translate-x-0"
          } ${
            sidebarCollapsed ? "w-20" : "w-64"
          } bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl transition-all duration-300 md:relative md:translate-x-0 border-r border-gray-200 dark:border-gray-700`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${theme.textPrimary} text-xl font-semibold`}
              >
                Spiritual Formation
              </motion.h1>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}
          </div>

          <nav className="mt-4 px-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={`w-full flex items-center p-3 text-left font-medium rounded-xl mb-2 transition-all duration-200 ${
                  activeSection === section.id
                    ? `${theme.primary} text-white shadow-md`
                    : `bg-transparent ${theme.textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
                onClick={() => {
                  setActiveSection(section.id);
                  if (isMobile) setShowMobileSidebar(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3"
                  >
                    {section.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isMobile ? "" : sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="p-4 md:p-6">
            {/* Header */}
            <motion.div
              className="mb-6 flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1
                  id="dashboard-heading"
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {sections.find((s) => s.id === activeSection)?.label ||
                    "Spiritual Formation"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your church's spiritual growth and discipleship
                  programs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  JD
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              role="main"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === "discipleship" && (
                    <div>
                      <DiscipleshipManagement />
                    </div>
                  )}
                  {activeSection === "curriculum" && <CurriculumBuilder />}
                  {activeSection === "progress" && <ProgressTracking />}
                  {activeSection === "groups" && <SmallGroupOversight />}
                  {activeSection === "sacramental" && (
                    <SacramentalPreparation />
                  )}
                  {activeSection === "seasonal" && <SeasonalPlanning />}
                  {activeSection === "prayer" && (
                    <div className="text-center py-12">
                      <FaPray className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Prayer Ministry
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Manage prayer requests and prayer teams
                      </p>
                    </div>
                  )}
                  {activeSection === "outreach" && (
                    <div className="text-center py-12">
                      <FaHandsHelping className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Outreach Programs
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Coordinate community outreach initiatives
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Users className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      142
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Members
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                    <BookOpen className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      8
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Groups
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                    <ChartBar className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      78%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Engagement Rate
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

// Enhanced Discipleship Management Component
function DiscipleshipManagement() {
  const groups = [
    {
      id: 1,
      name: "Alpha Group",
      leader: "John Smith",
      members: 12,
      status: "Active",
      progress: 85,
    },
    {
      id: 2,
      name: "Beta Group",
      leader: "Sarah Johnson",
      members: 8,
      status: "Struggling",
      progress: 45,
    },
    {
      id: 3,
      name: "Gamma Group",
      leader: "Michael Brown",
      members: 15,
      status: "Active",
      progress: 92,
    },
  ];

  const statusColors = {
    Active: "text-green-600 dark:text-green-400",
    Struggling: "text-amber-600 dark:text-amber-400",
    Inactive: "text-red-600 dark:text-red-400",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className={`${theme.textPrimary} text-xl font-semibold`}>
          Groups Overview
        </h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
          + Create New Group
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr
              className={`${theme.textSecondary} bg-gray-50 dark:bg-gray-700/50`}
            >
              <th className="p-3 text-left text-sm font-medium">Group Name</th>
              <th className="p-3 text-left text-sm font-medium">Leader</th>
              <th className="p-3 text-left text-sm font-medium">Members</th>
              <th className="p-3 text-left text-sm font-medium">Progress</th>
              <th className="p-3 text-left text-sm font-medium">Status</th>
              <th className="p-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="p-3 font-medium text-gray-900 dark:text-white">
                  {group.name}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400">
                  {group.leader}
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {group.members} members
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                      <div
                        className={`h-full rounded-full ${
                          group.progress > 70
                            ? "bg-green-500"
                            : group.progress > 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {group.progress}%
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      group.status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : group.status === "Struggling"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {group.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
