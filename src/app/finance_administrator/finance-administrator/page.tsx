"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ContributionManagement from "@/components/finance_administrator/sections/ContributionManagement";
import FinancialOversight from "@/components/finance_administrator/sections/FinancialOversight";
import ReportingCompliance from "@/components/finance_administrator/sections/ReportingCompliance";
import OnlineGivingOptimization from "@/components/finance_administrator/sections/OnlineGivingOptimization";
import FinancialSupportRequests from "@/components/finance_administrator/sections/FinancialSupportRequests";
import DonationPlans from "@/components/finance_administrator/sections/DonationPlans";
import Budgets from "@/components/finance_administrator/sections/Budgets";
import GivingPage from "@/app/finance_administrator/giving/page";
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
  DollarSign,
  HandHeart,
  ListPlus,
  PiggyBank,
} from "lucide-react";

// Section icons mapping
const sectionIcons = {
  contributions: <DollarSign className="h-5 w-5" />,
  financials: <PieChart className="h-5 w-5" />,
  reporting: <FileText className="h-5 w-5" />,
  giving: <CreditCard className="h-5 w-5" />,
  support: <HandHeart className="h-5 w-5" />,
  plans: <ListPlus className="h-5 w-5" />,
  budgets: <PiggyBank className="h-5 w-5" />,
  "giving-opportunities": <HandHeart className="h-5 w-5" />,
};

// Section titles mapping
const sectionTitles = {
  contributions: "Contribution Management",
  financials: "Financial Oversight",
  reporting: "Reporting & Compliance",
  giving: "Online Giving",
  support: "Support Requests",
  plans: "Donation Plans",
  budgets: "Budgets",
  "giving-opportunities": "Giving",
};

export default function FinanceAdministratorDashboard() {
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

  // Determine which component to render based on activeSection
  const renderSectionComponent = () => {
    switch (activeSection) {
      case "contributions":
        return <ContributionManagement donations={donations} />;
      case "financials":
        return <FinancialOversight transactions={donations} />;
      case "reporting":
        return <ReportingCompliance auditLogs={auditLogs} />;
      case "giving":
        return <OnlineGivingOptimization />;
      case "support":
        return <FinancialSupportRequests />;
      case "plans":
        return <DonationPlans searchQuery={planSearchQuery} />;
      case "budgets":
        return <Budgets />;
      case "giving-opportunities":
        return <GivingPage />;
      default:
        return <ContributionManagement donations={donations} />;
    }
  };

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

        <div className="">
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
                  {renderSectionComponent()}
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
