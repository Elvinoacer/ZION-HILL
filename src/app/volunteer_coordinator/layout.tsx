"use client";
import { Menu, X } from "lucide-react";
import { useVolunteerCoordinatorStore } from "@/store/volunteerCoordinatorStore";
import VolunteerCoordinatorSidebar from "@/components/volunteer_coordinator/VolunteerCoordinatorSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function VolunteerCoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu } =
    useVolunteerCoordinatorStore();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes("VOLUNTEER_COORDINATOR");

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {hasRequiredRole && <VolunteerCoordinatorSidebar />}
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-blue-400" />
              ) : (
                <Menu className="h-5 w-5 text-blue-400" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-white">
              Volunteer Coordinator
            </h1>
            <div className="w-9"></div> {/* Spacer for balance */}
          </div>
        </header>

        <div className="p-4 md:p-6 overflow-x-hidden">
          <main className="max-w-7xl mx-auto">{children}</main>
        </div>
      </div>

      {/* Floating action button for mobile */}
      <AnimatePresence>
        {!mobileMenuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleMobileMenu}
            className="fixed bottom-6 right-6 z-50 md:hidden p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
