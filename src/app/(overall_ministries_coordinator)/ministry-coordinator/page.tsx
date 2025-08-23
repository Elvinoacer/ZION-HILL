"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Calendar,
  DollarSign,
  BarChart2,
  ClipboardList,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import MinistryOverview from "@/components/admin-ministries/MinistryOverview";
import { BudgetMonitoringSection } from "@/components/admin-ministries/BudgetMonitoringSection";
import { PerformanceDashboard } from "@/components/admin-ministries/PerformanceDashboard";
import { CoordinationSection } from "@/components/admin-ministries/CoordinationSection";
import { HealthMonitoringSection } from "@/components/admin-ministries/HealthMonitoringSection";
import { VolunteerSection } from "@/components/admin-ministries/VolunteerSection";
import { useMinistryStore, useDonationStore, useVolunteerStore } from "@/store";
import { useMediaQuery } from "./useMediaQuery"; // Assuming you have a media query hook

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "performance", label: "Performance", icon: BarChart2 },
  { id: "budget", label: "Budgets", icon: DollarSign },
  { id: "coordination", label: "Coordination", icon: Calendar },
  { id: "health", label: "Health Monitor", icon: ShieldCheck },
  { id: "volunteer", label: "Volunteers", icon: Users },
];

// Main Dashboard Component
export default function AdminMinistryDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    ministries,
    loading: ministryLoading,
    error: ministryError,
    fetchMinistries,
  } = useMinistryStore();
  const {
    donations,
    transactions,
    loading: donationLoading,
    error: donationError,
    fetchDonations,
    fetchTransactions,
  } = useDonationStore();
  const {
    volunteers,
    loading: volunteerLoading,
    error: volunteerError,
    fetchVolunteers,
  } = useVolunteerStore();

  useEffect(() => {
    fetchMinistries();
    fetchDonations();
    fetchTransactions();
    fetchVolunteers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const loading = ministryLoading || donationLoading || volunteerLoading;
  const error = ministryError || donationError || volunteerError;

  const ActiveComponent = () => {
    switch (activeSection) {
      case "overview":
        return <MinistryOverview ministries={ministries} />;
      case "budget":
        return (
          <BudgetMonitoringSection
            ministries={ministries}
            transactions={transactions}
          />
        );
      case "performance":
        return <PerformanceDashboard ministries={ministries} />;
      case "coordination":
        return <CoordinationSection ministries={ministries} />;
      case "health":
        return <HealthMonitoringSection ministries={ministries} />;
      case "volunteer":
        return <VolunteerSection volunteers={volunteers} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDesktop={isDesktop}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSectionLabel={
            sections.find((s) => s.id === activeSection)?.label || "Dashboard"
          }
        />
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {loading && <div className="text-center">Loading...</div>}
          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}
          {!loading && !error && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sidebar Component
const DashboardSidebar = ({
  isOpen,
  setIsOpen,
  activeSection,
  setActiveSection,
  isDesktop,
}) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col md:relative md:translate-x-0`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Ministries</h1>
            {!isDesktop && (
              <button onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  if (!isDesktop) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
    {!isDesktop && isOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setIsOpen(false)}
      ></div>
    )}
  </>
);

// Header Component
const DashboardHeader = ({
  isSidebarOpen,
  setSidebarOpen,
  activeSectionLabel,
}) => (
  <header className="bg-white shadow-sm p-4 flex items-center md:hidden">
    <button onClick={() => setSidebarOpen(true)} className="mr-4">
      <Menu className="h-6 w-6" />
    </button>
    <h2 className="text-lg font-semibold">{activeSectionLabel}</h2>
  </header>
);
