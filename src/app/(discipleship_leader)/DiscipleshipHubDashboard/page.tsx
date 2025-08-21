"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Users, Heart, Book, MessageSquare } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GroupFacilitation from "@/components/admin/discipleship/GroupFacilitation";
import MemberCare from "@/components/admin/discipleship/MemberCare";
import ResourceDistribution from "@/components/admin/discipleship/ResourceDistribution";
import CommunicationChannels from "@/components/admin/discipleship/CommunicationChannels";
import ManageThemeOfTheWeekPage from "../courses/discipleship/theme-of-the-week/manage/page";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDiscipleshipStore } from "@/store";

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

export default function DiscipleshipHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("facilitation");

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

  if (loading)
    return <div className="text-center py-8">Loading discipleship data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

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
                Discipleship Hub
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
              <Link href={section.href} key={section.id}>
                <motion.button
                  className={`w-full flex items-center p-4 text-left ${
                    activeSection === section.id
                      ? `${theme.primary} text-white`
                      : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
                  }`}
                  whileHover={{ scale: 1.03 }}
                  aria-current={
                    activeSection === section.id ? "page" : undefined
                  }
                >
                  <section.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {!sidebarCollapsed && section.label}
                </motion.button>
              </Link>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 id="dashboard-heading" className="sr-only">
            Discipleship & Community Building Hub
          </h1>
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 bg-blue-50/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="main"
            aria-labelledby="dashboard-heading"
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
        </div>
      </div>
    </DndProvider>
  );
}
