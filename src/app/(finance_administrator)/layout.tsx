"use client";
import { Menu, X } from 'lucide-react';
import { useFinanceDashboardStore } from '@/store/financeDashboardStore';
import FinanceAdministratorSidebar from '@/components/finance_administrator/FinanceAdministratorSidebar';
import FinanceAdministratorHeader from '@/components/finance_administrator/FinanceAdministratorHeader';

export default function FinanceAdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen } = useFinanceDashboardStore();

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <FinanceAdministratorSidebar />
      
      {/* Toggle button for sidebar */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
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

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="p-4 md:p-6">
          <FinanceAdministratorHeader />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
