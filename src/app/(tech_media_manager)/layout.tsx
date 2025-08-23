"use client";
import { Menu, X } from 'lucide-react';
import { useTechMediaManagerStore } from '@/store/techMediaManagerStore';
import TechMediaManagerSidebar from '@/components/tech_media_manager/TechMediaManagerSidebar';

export default function TechMediaManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu } = useTechMediaManagerStore();

  return (
    <div className="relative flex min-h-screen bg-gray-900 text-gray-200"> {/* Dark theme background */}
      <TechMediaManagerSidebar />
      
      {/* Toggle button for sidebar */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-800 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 border border-gray-700/50" /* Dark theme styling */
          aria-label="Toggle sidebar"
        >
          {mobileMenuOpen || !sidebarCollapsed ? (
            <X className="h-6 w-6 text-blue-400" /> /* Dark theme icon color */
          ) : (
            <Menu className="h-6 w-6 text-blue-400" /> /* Dark theme icon color */
          )}
        </button>
      </div>

      <div className="flex-1 transition-all duration-300 min-w-0">
        <div className="p-4 md:p-6 overflow-x-hidden">
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
