"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Mail, Calendar, FileText, Users } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CommunicationHub from "@/components/admin/command-center/CommunicationHub";
import CalendarScheduling from "@/components/admin/command-center/CalendarScheduling";
import DocumentManagement from "@/components/admin/command-center/DocumentManagement";
import MemberServices from "@/components/admin/command-center/MemberServices";

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-100",
  secondaryHover: "hover:bg-gray-200",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  accentBlue: "bg-blue-50",
  accentGreen: "bg-green-50",
  accentPurple: "bg-purple-50",
};

export default function AdminCommandCenterDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("communication");

  const sections = [
    { id: "communication", label: "Communication Hub", icon: Mail },
    { id: "calendar", label: "Calendar & Scheduling", icon: Calendar },
    { id: "documents", label: "Document Management", icon: FileText },
    { id: "members", label: "Member Services", icon: Users },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="stars"></div>
        </div>
        <style jsx>{`
          .stars {
            background: transparent;
            height: 100%;
            width: 100%;
            position: absolute;
          }
          .stars::before,
          .stars::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='1.5' fill='white' opacity='0.4'/%3E%3Ccircle cx='100' cy='20' r='1' fill='white' opacity='0.3'/%3E%3C/svg%3E");
            animation: twinkle 20s infinite linear;
          }
          .stars::after {
            animation-delay: -10s;
          }
          @keyframes twinkle {
            0% {
              opacity: 0.3;
              transform: translateY(0);
            }
            50% {
              opacity: 0.6;
            }
            100% {
              opacity: 0.3;
              transform: translateY(-10px);
            }
          }
        `}</style>

        {/* Sidebar */}
        <motion.div
          className={`
            fixed top-0 left-0 h-full z-50 bg-white shadow-2xl transition-all duration-300
            ${sidebarCollapsed ? "w-16" : "w-64 md:w-72"}
            md:relative md:h-auto
          `}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            {!sidebarCollapsed && (
              <h1 className={`${theme.textPrimary} text-xl md:text-2xl font-bold tracking-tight`}>
                Admin Dashboard
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-100"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <Menu className="h-6 w-6 text-gray-600" />
              ) : (
                <X className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
          <nav className="mt-4 flex flex-col gap-1 px-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={`
                  w-full flex items-center p-3 text-left rounded-lg
                  ${activeSection === section.id ? `${theme.primary} text-white` : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`}
                  transition-colors duration-200
                `}
                onClick={() => {
                  setActiveSection(section.id);
                  if (window.innerWidth < 768) setSidebarCollapsed(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon className="h-5 w-5 min-w-[1.25rem] mr-3" aria-hidden="true" />
                {!sidebarCollapsed && <span className="text-sm md:text-base font-medium">{section.label}</span>}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Mobile Overlay */}
        {sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarCollapsed ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <h1 id="dashboard-heading" className="sr-only">
            Administrative Command Center
          </h1>
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 ${theme.accentBlue} max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            role="main"
            aria-labelledby="dashboard-heading"
          >
            {activeSection === "communication" && <CommunicationHub />}
            {activeSection === "calendar" && <CalendarScheduling />}
            {activeSection === "documents" && <DocumentManagement />}
            {activeSection === "members" && <MemberServices />}
          </motion.div>
        </div>
      </div>
    </DndProvider>
  );
}