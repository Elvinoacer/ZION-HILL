"use client";
import CommunicationChannels from "@/components/admin/discipleship/CommunicationChannels";
import GroupFacilitation from "@/components/admin/discipleship/GroupFacilitation";
import MemberCare from "@/components/admin/discipleship/MemberCare";
import ResourceDistribution from "@/components/admin/discipleship/ResourceDistribution";
import { useDiscipleshipStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Heart,
  Menu,
  MessageSquare,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Home,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ManageThemeOfTheWeekPage from "../courses/discipleship/theme-of-the-week/manage/page";

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

export default function DiscipleshipHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("facilitation");

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

  useEffect(() => {
    const active =
      sections.find((section) => pathname.startsWith(section.href))?.id ||
      "facilitation";
    setActiveSection(active);
  }, [pathname]);

  const {
    currentStudy,
    progress,
    resources,
    lessons,
    groups,
    prayerRequests,
    loading,
    error,
    fetchCurrentStudy,
    fetchProgress,
    fetchResources,
    fetchLessons,
    fetchGroups,
    fetchPrayerRequests,
  } = useDiscipleshipStore();

  useEffect(() => {
    // fetchCurrentStudy();
    // fetchProgress();
    // fetchResources();
    fetchLessons();
    fetchGroups();
    fetchPrayerRequests();
  }, [
    fetchCurrentStudy,
    fetchProgress,
    fetchResources,
    fetchLessons,
    fetchGroups,
    fetchPrayerRequests,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading discipleship data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700/60">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <X className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Data
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: "facilitation",
      label: "Group Facilitation",
      icon: Users,
      href: "/discipleship",
    },
    {
      id: "membercare",
      label: "Member Care",
      icon: Heart,
      href: "/discipleship/membercare",
    },
    {
      id: "resources",
      label: "Resource Distribution",
      icon: Book,
      href: "/discipleship/resources",
    },
    {
      id: "communication",
      label: "Communication Channels",
      icon: MessageSquare,
      href: "/discipleship/communication",
    },
    {
      id: "themes",
      label: "Manage Themes",
      icon: Book,
      href: "/discipleship/theme-of-the-week/manage",
    },
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
                Discipleship Hub
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
              <Link href={section.href} key={section.id}>
                <motion.button
                  className={`w-full flex items-center p-3 text-left font-medium rounded-xl mb-2 transition-all duration-200 ${
                    activeSection === section.id
                      ? `${theme.primary} text-white shadow-md`
                      : `bg-transparent ${theme.textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                  onClick={() => {
                    if (isMobile) setShowMobileSidebar(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-current={
                    activeSection === section.id ? "page" : undefined
                  }
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
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Home className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                    "Discipleship Hub"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Nurturing spiritual growth and community building
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

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Groups
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {groups?.length || 0}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                    <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Prayer Requests
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {prayerRequests?.length || 0}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                    <Book className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Resources
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {resources?.length || 0}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
                    <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Engagement
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      78%
                    </dd>
                  </div>
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
                  {activeSection === "facilitation" && (
                    <GroupFacilitation
                      currentStudy={currentStudy}
                      prayerRequests={prayerRequests}
                    />
                  )}
                  {activeSection === "membercare" && <MemberCare />}
                  {activeSection === "resources" && (
                    <ResourceDistribution resources={resources} />
                  )}
                  {activeSection === "communication" && (
                    <CommunicationChannels prayerRequests={prayerRequests} />
                  )}
                  {activeSection === "themes" && <ManageThemeOfTheWeekPage />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
