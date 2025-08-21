'use client';

import { useEffect } from "react";
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

export default function ChurchAdminDashboard() {
  const { activeSection, planSearchQuery } = useFinanceDashboardStore();

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

  useEffect(() => {
    fetchDonations();
    fetchActivityLogs();
  }, [fetchDonations, fetchActivityLogs]);

  if (donationLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-indigo-700">
            Loading section...
          </p>
        </div>
      </div>
    );
  }

  if (donationError || adminError) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-red-200 text-center">
        <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-600 mb-4">{donationError || adminError}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/90"
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
          {activeSection === "plans" && <DonationPlans searchQuery={planSearchQuery} />}
          {activeSection === "budgets" && <BudgetsContent />}
        </motion.div>
      </AnimatePresence>
    </DndProvider>
  );
}