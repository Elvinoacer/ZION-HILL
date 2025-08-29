"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OutreachDirectorSidebar from "@/components/outreach_director/OutreachDirectorSidebar";
import { useOutreachDirectorStore } from "@/store/outreachDirectorStore";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function OutreachDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mobileMenuOpen, toggleMobileMenu } = useOutreachDirectorStore();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes("OUTREACH_DIRECTOR");

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {hasRequiredRole && (
        <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
          <div className="fixed top-4 right-4 z-50 md:hidden">
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
                aria-label="Toggle sidebar"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-indigo-600" />
                ) : (
                  <Menu className="h-6 w-6 text-indigo-600" />
                )}
              </button>
            </SheetTrigger>
          </div>
          <OutreachDirectorSidebar />
        </Sheet>
      )}

      <div className="flex-1 transition-all duration-300 min-w-0">
        <div className="p-4 md:p-6 overflow-x-hidden">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
