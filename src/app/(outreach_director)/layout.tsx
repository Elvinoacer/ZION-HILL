"use client";
import { Menu, X } from 'lucide-react';
import { useOutreachDirectorStore } from '@/store/outreachDirectorStore';
import OutreachDirectorSidebar from '@/components/outreach_director/OutreachDirectorSidebar';

export default function OutreachDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu } = useOutreachDirectorStore();

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <OutreachDirectorSidebar />
      
      {/* Toggle button for sidebar (Desktop only, as mobile has its own toggle in sidebar component) */}
      <div className="fixed top-4 right-4 z-50 md:hidden"> {/* Added hidden md:block to ensure it's desktop only */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
          aria-label="Toggle sidebar"
        >
          {mobileMenuOpen || !sidebarCollapsed ? ( /* mobileMenuOpen is used here as per finance_admin pattern */
            <X className="h-6 w-6 text-indigo-600" />
          ) : (
            <Menu className="h-6 w-6 text-indigo-600" />
          )}
        </button>
      </div>

      <div className="flex-1 transition-all duration-300 min-w-0">
        <div className="p-4 md:p-6 overflow-x-hidden">
          {/* You can add a header component here if needed, similar to FinanceAdministratorHeader */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
