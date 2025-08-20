"use client";

import CounselingManagement from "@/components/admin/pastoralcare/CounselingManagement";
import DataReporting from "@/components/admin/pastoralcare/DataReporting";
import ResourceCoordination from "@/components/admin/pastoralcare/ResourceCoordination";
import AddCounselingTopic from "@/components/admin/pastoralcare/AddCounselingTopic";
import ManageCounselingTopics from "@/components/admin/pastoralcare/ManageCounselingTopics";
import PastoralCareMessaging from "@/components/PastoralCareMessaging"; // New import
import { motion } from "framer-motion";
import { AlertTriangle, BarChart, Calendar, Menu, Users, X, BookOpen, MessageSquare } from "lucide-react"; // Added MessageSquare
import { useEffect, useState } from "react";
import { usePastoralCareStore } from "@/store";
import { useSession } from "next-auth/react"; // New import
import { RoleName } from "@/generated/prisma"; // New import

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-50",
  secondaryHover: "hover:bg-gray-100",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
};

export default function PastoralCareDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("counseling");
  const { loading, error, fetchSessions, fetchTherapists } = usePastoralCareStore();
  const { data: session, status } = useSession(); // Get session

  const currentUserId = session?.user?.id || "";
  const currentUserRole = session?.user?.roles?.includes(RoleName.ADMIN) ? "ADMIN" : "COUNSELOR"; // Assuming admin for pastoral care dashboard

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-blue-600">Loading pastoral care data...</p>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600">Error: {error}. Please try again.</p>
        </motion.div>
      </div>
    );

  const sections = [
    { id: "counseling", label: "Counseling Management", icon: Calendar },
    { id: "resources", label: "Resource Coordination", icon: Users },
    { id: "reporting", label: "Data & Reporting", icon: BarChart },
    { id: "topics", label: "Counseling Topics", icon: BookOpen },
    { id: "messaging", label: "Messaging", icon: MessageSquare }, // New section
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <motion.aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white shadow-2xl border-r border-gray-200 transition-all duration-300 flex flex-col`}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          {!sidebarCollapsed && (
            <h1 className={`${theme.textPrimary} text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>Pastoral Care</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5 text-gray-600" /> : <X className="h-5 w-5 text-gray-600" />}
          </button>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto p-2">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              className={`w-full flex items-center rounded-lg px-4 py-3 mb-2 transition-all duration-200 text-left ${
                activeSection === section.id
                  ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg`
                  : `text-gray-700 hover:bg-gray-100`
              }`}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <section.icon className={`h-5 w-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"} ${activeSection === section.id ? "text-white" : "text-indigo-500"}`} />
              {!sidebarCollapsed && <span className="font-medium">{section.label}</span>}
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === "counseling" && <CounselingManagement />}
          {activeSection === "resources" && <ResourceCoordination />}
          {activeSection === "reporting" && <DataReporting />}
          {activeSection === "topics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddCounselingTopic />
              <ManageCounselingTopics />
            </div>
          )}
          {activeSection === "messaging" && (
            <PastoralCareMessaging currentUserId={currentUserId} currentUserRole="ADMIN" />
          )}
        </motion.div>
      </main>
    </div>
  );
}
