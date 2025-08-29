"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Video, Film, Database, Monitor, Wrench } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import StreamControlCenter from "@/components/admin/digitalhub/StreamControlCenter";
import MediaProduction from "@/components/admin/digitalhub/MediaProduction";
import DigitalAssetManagement from "@/components/admin/digitalhub/DigitalAssetManagement";
import WebsiteMaintenance from "@/components/admin/digitalhub/WebsiteMaintenance";
import TechSupportSystem from "@/components/admin/digitalhub/TechSupportSystem";

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-700", // Changed from gray-200
  secondaryHover: "hover:bg-gray-600", // Changed from gray-300
  textPrimary: "text-white", // Changed from gray-900
  textSecondary: "text-gray-300", // Changed from gray-600
  accentBlue: "bg-blue-900/30", // Changed from blue-100
  accentGreen: "bg-green-900/30", // Changed from green-100
  accentPurple: "bg-purple-900/30", // Changed from purple-100
};

export default function DigitalHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added for mobile responsiveness
  const [activeSection, setActiveSection] = useState("streaming");

  const sections = [
    { id: "streaming", label: "Stream Control", icon: Video },
    { id: "production", label: "Media Production", icon: Film },
    { id: "assets", label: "Digital Assets", icon: Database },
    { id: "website", label: "Website Maintenance", icon: Monitor },
    { id: "support", label: "Tech Support", icon: Wrench },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex min-h-screen bg-gray-900 text-gray-200"> {/* Changed background */}
        {/* Removed stars CSS */}

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
          <div className="p-4 flex justify-between items-center border-b border-gray-700/50 h-16">
            {!sidebarCollapsed && (
              <h1 className={`${theme.textPrimary} text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap`}>
                Digital Hub
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:block p-2 rounded-full hover:bg-gray-700/80 transition-colors"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
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
                onClick={() => {
                  setActiveSection(section.id);
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon
                  className={`h-5 w-5 transition-all ${
                    sidebarCollapsed ? "mx-auto" : "mr-3"
                  } ${
                    activeSection === section.id ? "text-white" : "text-blue-300"
                  }`}
                  aria-hidden="true"
                />
                {!sidebarCollapsed && (
                  <span className="font-medium">{section.label}</span>
                )}
              </motion.button>
            ))}
          </nav>
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
            <h1 id="dashboard-heading" className="sr-only">
              Digital Infrastructure and Content Production Hub
            </h1>
            <motion.div
              className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              role="main"
              aria-labelledby="dashboard-heading"
            >
              {activeSection === "streaming" && <StreamControlCenter />}
              {activeSection === "production" && <MediaProduction />}
              {activeSection === "assets" && <DigitalAssetManagement />}
              {activeSection === "website" && <WebsiteMaintenance />}
              {activeSection === "support" && <TechSupportSystem />}
            </motion.div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}
