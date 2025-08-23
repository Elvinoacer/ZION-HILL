"use client";

import AddCounselingTopic from "@/components/admin/pastoralcare/AddCounselingTopic";
import CounselingManagement from "@/components/admin/pastoralcare/CounselingManagement";
import DataReporting from "@/components/admin/pastoralcare/DataReporting";
import ManageCounselingTopics from "@/components/admin/pastoralcare/ManageCounselingTopics";
import ResourceCoordination from "@/components/admin/pastoralcare/ResourceCoordination";
import PastoralCareMessaging from "@/components/PastoralCareMessaging";
import { usePastoralCareStore } from "@/store";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart,
  BookOpen,
  Calendar,
  Loader2,
  Menu,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PastoralCareDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("counseling");
  const { loading, error, fetchSessions, fetchTherapists } =
    usePastoralCareStore();
  const { data: session } = useSession();

  const currentUserId = session?.user?.id || "";

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
  }, [fetchSessions, fetchTherapists]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
          <p className="text-lg font-medium text-gray-300">
            Loading Pastoral Care Data...
          </p>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-900 p-4"
      >
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => {
              fetchSessions();
              fetchTherapists();
            }}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );

  const sections = [
    { id: "counseling", label: "Counseling", icon: Calendar },
    { id: "resources", label: "Resources", icon: Users },
    { id: "reporting", label: "Reporting", icon: BarChart },
    { id: "topics", label: "Topics", icon: BookOpen },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 flex justify-between items-center border-b border-gray-700/50 h-16">
        {!sidebarCollapsed && (
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
          >
            Pastoral Care
          </motion.h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:block p-2 rounded-full hover:bg-gray-700/80 transition-colors"
        >
          <Menu className="h-5 w-5 text-blue-400" />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-2 rounded-full hover:bg-gray-700/80 transition-colors"
        >
          <X className="h-5 w-5 text-blue-400" />
        </button>
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
              ${sidebarCollapsed ? "justify-center" : ""}
            `}
            onClick={() => handleSectionClick(section.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <section.icon
              className={`h-5 w-5 transition-all ${
                sidebarCollapsed ? "mx-auto" : "mr-3"
              } ${
                activeSection === section.id ? "text-white" : "text-blue-300"
              }`}
            />
            {!sidebarCollapsed && (
              <span className="font-medium">{section.label}</span>
            )}
          </motion.button>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full z-40 bg-gray-800 shadow-2xl border-r border-gray-700/50 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-800/70 backdrop-blur-sm border-b border-gray-700/50 h-16">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {sections.find((s) => s.id === activeSection)?.label}
          </h2>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === "counseling" && <CounselingManagement />}
            {activeSection === "resources" && <ResourceCoordination />}
            {activeSection === "reporting" && <DataReporting />}
            {activeSection === "topics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AddCounselingTopic />
                <ManageCounselingTopics />
              </div>
            )}
            {activeSection === "messaging" && (
              <PastoralCareMessaging
                currentUserId={currentUserId}
                currentUserRole="ADMIN"
              />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
