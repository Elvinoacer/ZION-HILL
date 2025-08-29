"use client";
import { Menu, X } from 'lucide-react';
import { useSecretaryStore } from '@/store/secretaryStore';
import SecretarySidebar from '@/components/secretary/SecretarySidebar';
import { useSession } from 'next-auth/react';

export default function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu } = useSecretaryStore();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes('SECRETARY');

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {hasRequiredRole && <SecretarySidebar />}
      
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Toggle button for sidebar */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          aria-label="Toggle sidebar"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-blue-400" />
          ) : (
            <Menu className="h-6 w-6 text-blue-400" />
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