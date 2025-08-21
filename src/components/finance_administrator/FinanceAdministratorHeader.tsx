'use client';

import { Menu, X, Bell, Search, User } from 'lucide-react';
import { useFinanceDashboardStore } from '@/store/financeDashboardStore';

const FinanceAdministratorHeader = () => {
  const { 
    sidebarCollapsed, 
    mobileMenuOpen, 
    planSearchQuery, 
    activeSection, 
    setPlanSearchQuery, 
    toggleSidebar 
  } = useFinanceDashboardStore();

  // This should ideally come from a shared place with the sidebar
  const sections = [
    { id: "contributions", label: "Contribution Management" },
    { id: "financial", label: "Financial Oversight" },
    { id: "reporting", label: "Reporting & Compliance" },
    { id: "giving", label: "Online Giving" },
    { id: "support", label: "Support Requests" },
    { id: "plans", label: "Donation Plans" },
    { id: "budgets", label: "Budgets" },
  ];

  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || "Dashboard";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {activeSectionLabel}
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
  );
};

export default FinanceAdministratorHeader;
