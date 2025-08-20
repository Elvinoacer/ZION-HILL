"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Book, Shield, Heart, AlertTriangle } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MinistryProgramManagement from "@/components/admin/DiscipleshipSafetyHubDashboard/MinistryProgramManagement";
import VolunteerCoordination from "@/components/admin/DiscipleshipSafetyHubDashboard/VolunteerCoordination";
import FamilyEngagement from "@/components/admin/DiscipleshipSafetyHubDashboard/FamilyEngagement";
import SafetyCompliance from "@/components/admin/DiscipleshipSafetyHubDashboard/SafetyCompliance";
import { useDiscipleshipStore, useVolunteerStore } from "@/store";

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-200",
  secondaryHover: "hover:bg-gray-300",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  accentBlue: "bg-blue-100",
  accentGreen: "bg-green-100",
  accentPurple: "bg-purple-100",
};

export default function DiscipleshipSafetyHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("ministry");

  const {
    lessons,
    loading: discipleshipLoading,
    error: discipleshipError,
    fetchLessons,
  } = useDiscipleshipStore();

  const {
    volunteers,
    shifts,
    loading: volunteerLoading,
    error: volunteerError,
    fetchVolunteers,
    fetchShifts,
  } = useVolunteerStore();

  useEffect(() => {
    fetchLessons();
    fetchVolunteers();
    fetchShifts();
  }, [fetchLessons, fetchVolunteers, fetchShifts]);

  if (discipleshipLoading || volunteerLoading) return <div className="text-center py-8">Loading discipleship safety data...</div>;
  if (discipleshipError || volunteerError) return <div className="text-center py-8 text-red-500">Error: {discipleshipError || volunteerError}</div>;

  const sections = [
    { id: "ministry", label: "Ministry Programs", icon: Book },
    { id: "volunteer", label: "Volunteer Coordination", icon: Shield },
    { id: "family", label: "Family Engagement", icon: Heart },
    { id: "safety", label: "Safety & Compliance", icon: AlertTriangle },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="stars"></div>
        </div>
        <style jsx>{`
          .stars {
            background: transparent;
            height: 100%;
            width: 100%;
            position: absolute;
            overflow: hidden;
          }
          .stars::before,
          .stars::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' opacity='0.2'/%3E%3Ccircle cx='50' cy='50' r='1.5' fill='white' opacity='0.3'/%3E%3Ccircle cx='100' cy='20' r='1' fill='white' opacity='0.2'/%3E%3C/svg%3E");
            animation: twinkle 15s infinite linear;
          }
          .stars::after {
            animation-delay: -7.5s;
          }
          @keyframes twinkle {
            0% {
              opacity: 0.2;
              transform: translateY(0);
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 0.2;
              transform: translateY(-10px);
            }
          }
        `}</style>

        {/* Sidebar */}
        <motion.div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white shadow-md transition-all duration-300`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex justify-between items-center">
            {!sidebarCollapsed && (
              <h1 className={`${theme.textPrimary} text-xl font-semibold`}>
                Discipleship & Safety Hub
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav className="mt-4">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={`w-full flex items-center p-4 text-left ${
                  activeSection === section.id
                    ? `${theme.primary} text-white`
                    : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
                }`}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.03 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {!sidebarCollapsed && section.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 id="dashboard-heading" className="sr-only">
            Discipleship & Safety Management Hub
          </h1>
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 bg-blue-50/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="main"
            aria-labelledby="dashboard-heading"
          >
            {activeSection === "ministry" && <MinistryProgramManagement lessons={lessons} />}
            {activeSection === "volunteer" && <VolunteerCoordination volunteers={volunteers} />}
            {activeSection === "family" && <FamilyEngagement lessons={lessons} />}
            {activeSection === "safety" && <SafetyCompliance />}
          </motion.div>
        </div>
      </div>
    </DndProvider>
  );
}
