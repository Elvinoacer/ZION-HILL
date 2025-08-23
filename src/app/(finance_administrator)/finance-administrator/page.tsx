"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ContributionManagement from "@/components/admin/churchadmindashboard/ContributionManagement";
import FinancialOversight from "@/components/admin/churchadmindashboard/FinancialOversight";
import ReportingCompliance from "@/components/admin/churchadmindashboard/ReportingCompliance";
import OnlineGivingOptimization from "@/components/admin/churchadmindashboard/OnlineGivingOptimization";
import FinancialSupportRequests from "@/components/admin/churchadmindashboard/FinancialSupportRequests";
import DonationPlans from "@/components/admin/churchadmindashboard/DonationPlans";
import BudgetsContent from "@/components/finance_administrator/BudgetsContent";
import { useDonationStore, useAdminStore } from "@/store";
import { useFinanceDashboardStore } from "@/store/financeDashboardStore";
import {
  BarChart3,
  CreditCard,
  FileText,
  Gift,
  HelpCircle,
  Target,
  PieChart,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Section icons mapping
const sectionIcons = {
  contributions: <CreditCard className="h-5 w-5" />,
  financial: <BarChart3 className="h-5 w-5" />,
  reporting: <FileText className="h-5 w-5" />,
  giving: <Gift className="h-5 w-5" />,
  support: <HelpCircle className="h-5 w-5" />,
  plans: <Target className="h-5 w-5" />,
  budgets: <PieChart className="h-5 w-5" />,
};

// Section titles mapping
const sectionTitles = {
  contributions: "Contribution Management",
  financial: "Financial Oversight",
  reporting: "Reporting & Compliance",
  giving: "Online Giving Optimization",
  support: "Financial Support Requests",
  plans: "Donation Plans",
  budgets: "Budgets",
};

export default function ChurchAdminDashboard() {
  const { activeSection, planSearchQuery, setActiveSection } =
    useFinanceDashboardStore();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    donations,
    loading: donationLoading,
    error: donationError,
    fetchDonations,
  } = useDonationStore();
  const {
    auditLogs,
    loading: adminLoading,
    error: adminError,
    fetchActivityLogs,
  } = useAdminStore();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && !event.target?.closest(".sidebar")) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    fetchDonations();
    fetchActivityLogs();
  }, [fetchDonations, fetchActivityLogs]);

  const handleRetry = () => {
    fetchDonations();
    fetchActivityLogs();
  };

  const sectionKeys = Object.keys(sectionTitles) as Array<
    keyof typeof sectionTitles
  >;

  const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-indigo-700">
          Loading dashboard...
        </p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-red-200 text-center">
      <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Error Loading Data
      </h2>
      <p className="text-gray-600 mb-4">{donationError || adminError}</p>
      <button
        onClick={handleRetry}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </button>
    </div>
  );

  const NavigationSidebar = () => (
    <motion.div
      className={`sidebar bg-gradient-to-b from-indigo-800 to-indigo-900 text-white p-4 rounded-xl shadow-lg ${
        isMobile ? "fixed top-0 left-0 h-full w-64 z-50" : "sticky top-4 h-fit"
      }`}
      initial={isMobile ? { x: -300 } : false}
      animate={isMobile ? { x: sidebarOpen ? 0 : -300 } : false}
      transition={{ duration: 0.3 }}
    >
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full bg-indigo-700 hover:bg-indigo-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Finance Dashboard</h2>
        <p className="text-indigo-200 text-sm">Manage church finances</p>
      </div>

      <nav className="space-y-1">
        {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveSection(key);
              if (isMobile) setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeSection === key
                ? "bg-white text-indigo-700 shadow-md"
                : "text-indigo-100 hover:bg-indigo-700"
            }`}
          >
            <span className="mr-3 opacity-80">{sectionIcons[key]}</span>
            <span className="font-medium">{sectionTitles[key]}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-indigo-700">
        <div className="text-xs text-indigo-300 mb-2">Last updated</div>
        <div className="text-sm text-indigo-100">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );

  if (donationLoading || adminLoading) {
    return <LoadingState />;
  }

  if (donationError || adminError) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-indigo-100 text-indigo-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-indigo-900">
              {sectionTitles[activeSection]}
            </h1>
            <div className="w-9"></div> {/* Spacer for balance */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          {/* Desktop sidebar */}
          {!isMobile && <NavigationSidebar />}

          {/* Mobile sidebar (overlay) */}
          {isMobile && sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <NavigationSidebar />
            </>
          )}

          {/* Main content */}
          <div>
            {/* Desktop header */}
            {!isMobile && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-indigo-900 flex items-center">
                  <span className="mr-3 text-indigo-600">
                    {sectionIcons[activeSection]}
                  </span>
                  {sectionTitles[activeSection]}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor church {activeSection} activities
                </p>
              </div>
            )}

            <DndProvider backend={HTML5Backend}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  className="bg-white rounded-xl shadow-lg p-4 md:p-6 backdrop-blur-sm bg-white/90 border border-indigo-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === "contributions" && (
                    <ContributionManagement donations={donations} />
                  )}
                  {activeSection === "financial" && (
                    <FinancialOversight transactions={donations} />
                  )}
                  {activeSection === "reporting" && (
                    <ReportingCompliance auditLogs={auditLogs} />
                  )}
                  {activeSection === "giving" && <OnlineGivingOptimization />}
                  {activeSection === "support" && <FinancialSupportRequests />}
                  {activeSection === "plans" && (
                    <DonationPlans searchQuery={planSearchQuery} />
                  )}
                  {activeSection === "budgets" && <BudgetsContent />}
                </motion.div>
              </AnimatePresence>
            </DndProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing icon components
const X = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Menu = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
