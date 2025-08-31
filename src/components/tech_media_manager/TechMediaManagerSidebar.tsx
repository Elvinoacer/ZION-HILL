"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTechMediaManagerStore } from "@/store/techMediaManagerStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, Monitor, Globe } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";
import { useState } from "react";

const navItems = [
  { href: "/tech_media_manager/DigitalHubDashboard", label: "Digital Hub Dashboard", icon: Monitor },
  { href: "/tech_media_manager", label: "Tech & Media Manager", icon: LayoutDashboard },
];

export default function TechMediaManagerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const { sidebarCollapsed, mobileMenuOpen, closeMobileMenu } = useTechMediaManagerStore();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-4 p-4">
        <h2 className={cn("text-lg font-semibold text-white", sidebarCollapsed ? "hidden" : "block")}>
          Tech & Media
        </h2>
      </div>
      <nav className="flex flex-col space-y-1 w-full flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium",
              pathname === item.href
                ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white",
              sidebarCollapsed ? "justify-center" : "",
              "transition-all duration-200"
            )}
          >
            <item.icon className={cn("h-6 w-6", sidebarCollapsed ? "" : "mr-3", "text-blue-300")} />
            <span className={cn(sidebarCollapsed ? "hidden" : "block")}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className={cn("p-4 border-t border-gray-700", sidebarCollapsed ? "w-20" : "w-64")}>
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
          <div className={cn("ml-3 flex-1", sidebarCollapsed ? "hidden" : "block")}>
            <div className="font-semibold text-white truncate">
              {session?.user?.name || "Guest"}
            </div>
            <div className="text-xs text-gray-400 capitalize truncate">
              {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                "Public User"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className={cn("w-full flex items-center justify-center mt-4 p-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-400 transition-all", sidebarCollapsed ? "hidden" : "block")}
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={closeMobileMenu}>
        <SheetContent side="left" className="w-64 p-0 pt-16 bg-gray-800">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gray-800 border-r border-gray-700 h-screen sticky top-0 transition-all duration-300",
          sidebarCollapsed ? "w-20 items-center" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
      <AlertDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will be returned to the login page."
      />
    </>
  );
}
