'use client';

import { motion } from 'framer-motion';
import { PiggyBank, DollarSign, PieChart, FileText, CreditCard, HandHeart, ListPlus, Settings, User, Search } from 'lucide-react';
import { useFinanceDashboardStore } from '@/store/financeDashboardStore';
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";
import { useState } from "react";


const theme = {
  primary: "bg-indigo-600",
  secondary: "bg-gray-50",
  textSecondary: "text-gray-600",
  secondaryHover: "hover:bg-gray-100",
  textPrimary: "text-gray-900",
};

const sections = [
  {
    id: "contributions",
    label: "Contribution Management",
    icon: DollarSign,
    color: "text-blue-500",
  },
  {
    id: "financials",
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
  {
    id: "budgets",
    label: "Budgets",
    icon: PiggyBank,
    color: "text-teal-500",
  },
];

const FinanceAdministratorSidebar = () => {
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };
  
  const { 
    sidebarCollapsed, 
    mobileMenuOpen, 
    activeSection, 
    searchQuery, 
    setSearchQuery, 
    setActiveSection, 
    setMobileMenuOpen, 
    setSidebarCollapsed 
  } = useFinanceDashboardStore();

  const filteredSections = sections.filter((section) =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className={`fixed z-40 ${
        sidebarCollapsed ? "w-20" : "w-64"
      } h-screen bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      initial={{ x: -300 }}
      animate={{
        x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -300),
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

      <nav className="mt-4 overflow-y-auto flex-grow">
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
              setSidebarCollapsed(true);
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

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 overflow-hidden flex-shrink-0">
            {session?.user?.photo ? (
              <img
                src={session.user.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-400 text-4xl" />
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 flex-1">
              <div className="font-semibold text-gray-800 truncate">
                {session?.user?.name || "Guest"}
              </div>
              <div className="text-xs text-gray-500 capitalize truncate">
                {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                  "Public User"}
              </div>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center mt-4 p-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <Icons.logout className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </button>
        )}
      </div>
      <AlertDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will be returned to the login page."
      />
    </motion.div>
  );
};

export default FinanceAdministratorSidebar;


export default FinanceAdministratorSidebar;
