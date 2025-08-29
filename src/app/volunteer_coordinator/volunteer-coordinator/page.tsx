"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Calendar,
  Award,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import VolunteerRecruitment from "@/components/admin/volunteer/VolunteerRecruitment";
import SchedulingDeployment from "@/components/admin/volunteer/SchedulingDeployment";
import ReportingAnalytics from "@/components/admin/volunteer/ReportingAnalytics";
import VolunteerEngagement from "@/components/admin/volunteer/VolunteerEngagement";
import { useVolunteerStore } from "@/store";

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-700",
  secondaryHover: "hover:bg-gray-600",
  textPrimary: "text-white",
  textSecondary: "text-gray-300",
  accentBlue: "bg-blue-900/30",
  accentGreen: "bg-green-900/30",
  accentPurple: "bg-purple-900/30",
};

export default function VolunteerHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("recruitment");
  const [isMobile, setIsMobile] = useState(false);

  const {
    roles,
    shifts,
    volunteers,
    loading,
    error,
    fetchRoles,
    fetchShifts,
    fetchVolunteers,
  } = useVolunteerStore();

  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchShifts();
    fetchVolunteers();
  }, [fetchRoles, fetchShifts, fetchVolunteers]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-300">
            Loading volunteer hub data...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md text-center text-white shadow-lg">
          <p className="text-red-300">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const sections = [
    { id: "recruitment", label: "Volunteer Recruitment", icon: Users },
    { id: "scheduling", label: "Scheduling & Deployment", icon: Calendar },
    { id: "engagement", label: "Volunteer Engagement", icon: Award },
    { id: "analytics", label: "Reporting & Analytics", icon: BarChart },
  ];

  // Toggle sidebar with consideration for mobile devices
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Handle section change with mobile consideration
  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200">
        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar for desktop and mobile */}
        <motion.aside
          className={`fixed md:relative top-0 left-0 h-full z-40 bg-gray-800 shadow-2xl border-r border-gray-700/50 flex flex-col
            ${
              isMobile
                ? isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "translate-x-0"
            }
          `}
          initial={false}
          animate={{
            width: isMobile ? 256 : sidebarCollapsed ? 80 : 256,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-700/50 h-16">
            {(!sidebarCollapsed || isMobile) && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
              >
                Volunteer Hub
              </motion.h1>
            )}
            <div className="flex items-center space-x-2">
              {!isMobile && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-full hover:bg-gray-700/80 transition-colors"
                  aria-label={
                    sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-blue-400" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-blue-400" />
                  )}
                </button>
              )}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-700/80 transition-colors"
                >
                  <X className="h-5 w-5 text-blue-400" />
                </button>
              )}
            </div>
          </div>

          <nav className="mt-4 flex-1 overflow-y-auto p-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={`w-full flex items-center rounded-lg px-4 py-3 mb-2 transition-all duration-200 text-left
                  ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }
                  ${sidebarCollapsed && !isMobile ? "justify-center" : ""}
                `}
                onClick={() => handleSectionChange(section.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon
                  className={`h-5 w-5 transition-all ${
                    sidebarCollapsed && !isMobile ? "mx-auto" : "mr-3"
                  } ${
                    activeSection === section.id
                      ? "text-white"
                      : "text-blue-300"
                  }`}
                  aria-hidden="true"
                />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="font-medium">{section.label}</span>
                )}
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <header className="md:hidden flex items-center justify-between p-4 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 h-16 sticky top-0 z-20">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-white truncate max-w-xs px-2">
              {sections.find((s) => s.id === activeSection)?.label}
            </h2>
            <div className="w-10"></div> {/* Spacer for balance */}
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <h1 id="dashboard-heading" className="sr-only">
              Volunteer Recruitment & Management Hub
            </h1>

            {/* Mobile floating action button for sidebar */}
            {isMobile && !isMobileMenuOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </motion.button>
            )}

            <motion.div
              key={activeSection}
              className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              role="main"
              aria-labelledby="dashboard-heading"
            >
              {activeSection === "recruitment" && (
                <VolunteerRecruitment roles={roles} />
              )}
              {activeSection === "scheduling" && (
                <SchedulingDeployment shifts={shifts} />
              )}
              {activeSection === "engagement" && (
                <VolunteerEngagement volunteers={volunteers} />
              )}
              {activeSection === "analytics" && <ReportingAnalytics />}
            </motion.div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}
