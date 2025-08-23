"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Share2,
  Users,
  BarChart2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ContentCreation from "@/components/admin/BrandEngagementHubDashboard/ContentCreation";
import CongregationEngagement from "@/components/admin/BrandEngagementHubDashboard/CongregationEngagement";
import AnalyticsOptimization from "@/components/admin/BrandEngagementHubDashboard/AnalyticsOptimization";
import CrisisCommunication from "@/components/admin/BrandEngagementHubDashboard/CrisisCommunication";
import { useBrandEngagementStore } from "@/store";

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

export default function BrandEngagementHubDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("content");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
        setShowMobileSidebar(false);
      } else {
        setShowMobileSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    templates,
    assets,
    bulletins,
    alerts,
    statements,
    loading,
    error,
    fetchTemplates,
    fetchAssets,
    fetchBulletins,
    fetchAlerts,
    fetchStatements,
  } = useBrandEngagementStore();

  useEffect(() => {
    fetchTemplates();
    fetchAssets();
    fetchBulletins();
    fetchAlerts();
    fetchStatements();
  }, [
    fetchTemplates,
    fetchAssets,
    fetchBulletins,
    fetchAlerts,
    fetchStatements,
  ]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading brand engagement data...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const sections = [
    { id: "content", label: "Content Creation", icon: Share2 },
    { id: "engagement", label: "Congregation Engagement", icon: Users },
    { id: "analytics", label: "Analytics & Optimization", icon: BarChart2 },
    { id: "crisis", label: "Crisis Communication", icon: AlertTriangle },
  ];

  const sectionTitles = {
    content: "Content Creation",
    engagement: "Congregation Engagement",
    analytics: "Analytics & Optimization",
    crisis: "Crisis Communication",
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CiAgICAgIDxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIHg9IjAiIHk9IjAiLz4KICAgICAgPHJlY3Qgd2lkdGg9IjMiIGhlaWdodD0iMyIgeD0iMzAiIHk9IjAiLz4KICAgICAgPHJlY3Qgd2lkdGg9IjMiIGhlaWdodD0iMyIgeD0iMCIgeT0iMzAiLz4KICAgICAgPHJlY3Qgd2lkdGg9IjMiIGhlaWdodD0iMyIgeD0iMzAiIHk9IjMwIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K')]"></div>
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
          isMobile && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"
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
              className={`${theme.textPrimary} text-xl font-bold`}
            >
              Brand & Engagement Hub
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
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Brand Stewardship & Multiplatform Engagement Hub
            </p>
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
          <motion.div
            className="mb-4 md:mb-6 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {sectionTitles[activeSection]}
            </h1>
          </motion.div>

          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="main"
          >
            {activeSection === "content" && (
              <ContentCreation templates={templates} assets={assets} />
            )}
            {activeSection === "engagement" && (
              <CongregationEngagement bulletins={bulletins} />
            )}
            {activeSection === "analytics" && <AnalyticsOptimization />}
            {activeSection === "crisis" && (
              <CrisisCommunication alerts={alerts} statements={statements} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
