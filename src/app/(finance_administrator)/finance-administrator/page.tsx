"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  DollarSign,
  PieChart,
  FileText,
  CreditCard,
  HandHeart,
  ListPlus,
  Settings,
  User,
  Bell,
  Search,
} from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ContributionManagement from "@/components/admin/churchadmindashboard/ContributionManagement";
import FinancialOversight from "@/components/admin/churchadmindashboard/FinancialOversight";
import ReportingCompliance from "@/components/admin/churchadmindashboard/ReportingCompliance";
import OnlineGivingOptimization from "@/components/admin/churchadmindashboard/OnlineGivingOptimization";
import FinancialSupportRequests from "@/components/admin/churchadmindashboard/FinancialSupportRequests";
import DonationPlans from "@/components/admin/churchadmindashboard/DonationPlans";
import { useDonationStore, useAdminStore } from "@/store";

const theme = {
  primary: "bg-indigo-600",
  primaryHover: "hover:bg-indigo-700",
  secondary: "bg-gray-50",
  secondaryHover: "hover:bg-gray-100",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  accentBlue: "bg-blue-100 text-blue-800",
  accentGreen: "bg-green-100 text-green-800",
  accentPurple: "bg-purple-100 text-purple-800",
  accentOrange: "bg-orange-100 text-orange-800",
};

export default function ChurchAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("contributions");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For sidebar sections
  const [planSearchQuery, setPlanSearchQuery] = useState(""); // For donation plans

  const {
    donations,
    transactions,
    loading: donationLoading,
    error: donationError,
    fetchDonations,
    fetchTransactions,
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

  const sections = [
    {
      id: "contributions",
      label: "Contribution Management",
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      id: "financial",
      label: "Financial Oversight",
      icon: PieChart,
      color: "text-green-500",
    },
    {
      id: "reporting",
      label: "Reporting & Compliance",
      icon: FileText,
      color: "text-purple-500",
    },
    {
      id: "giving",
      label: "Online Giving",
      icon: CreditCard,
      color: "text-yellow-500",
    },
    {
      id: "support",
      label: "Support Requests",
      icon: HandHeart,
      color: "text-red-500",
    },
    {
      id: "plans",
      label: "Donation Plans",
      icon: ListPlus,
      color: "text-indigo-500",
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (donationLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-indigo-700">
            Loading Finance admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (donationError || adminError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-lg border border-red-200 text-center">
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
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{donationError || adminError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        {/* Universal Sidebar Toggle Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(!mobileMenuOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="p-2 rounded-lg bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
            aria-label="Toggle sidebar"
          >
            {mobileMenuOpen || !sidebarCollapsed ? (
              <X className="h-6 w-6 text-indigo-600" />
            ) : (
              <Menu className="h-6 w-6 text-indigo-600" />
            )}
          </button>
        </div>

        {/* Sidebar */}
        <motion.div
          className={`fixed z-40 ${
            sidebarCollapsed ? "w-20" : "w-64"
          } h-screen bg-white shadow-lg transition-all duration-300 ease-in-out`}
          initial={{ x: -300 }}
          animate={{
            x: mobileMenuOpen ? 0 : (window.innerWidth >= 768 ? 0 : -300),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            {!sidebarCollapsed && (
              <motion.h1
                className={`${theme.textPrimary} text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Finance Admin
              </motion.h1>
            )}
          </div>

          {/* Search in sidebar when expanded */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search sections..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          <nav className="mt-4 overflow-y-auto h-[calc(100vh-120px)]">
            {filteredSections.map((section) => (
              <motion.button
                key={section.id}
                className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${
                  activeSection === section.id
                    ? `${theme.primary} text-white shadow-md`
                    : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
                }`}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenuOpen(false);
                  setSidebarCollapsed(true); // Close sidebar after selection
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                <section.icon
                  className={`h-5 w-5 ${
                    activeSection === section.id ? "text-white" : section.color
                  }`}
                  aria-hidden="true"
                />
                {!sidebarCollapsed && (
                  <motion.span
                    className="ml-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {section.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
          {/* Top Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {sections.find((s) => s.id === activeSection)?.label ||
                  "Dashboard"}
              </h1>
              <p className="text-gray-600">
                Manage your church's financial activities and donations
              </p>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search donation plans..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={planSearchQuery}
                  onChange={(e) => setPlanSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
}
