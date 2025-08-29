"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useVolunteerCoordinatorStore } from "@/store/volunteerCoordinatorStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, Users } from "lucide-react";

const navItems = [
  {
    href: "/volunteer_coordinator/VolunteerHubDashboard",
    label: "Volunteer Hub Dashboard",
    icon: Users,
  },
  {
    href: "/volunteer_coordinator/volunteer-coordinator",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  
];

export default function VolunteerCoordinatorSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileMenuOpen, closeMobileMenu } =
    useVolunteerCoordinatorStore();

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={closeMobileMenu}>
        <SheetContent side="left" className="w-64 p-0 pt-16 bg-gray-800">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
                onClick={closeMobileMenu}
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gray-800 border-r border-gray-700 h-screen sticky top-0 p-4 transition-all duration-300",
          sidebarCollapsed ? "w-20 items-center" : "w-64"
        )}
      >
        <div className="mb-4">
          <h2
            className={cn(
              "text-lg font-semibold text-white",
              sidebarCollapsed ? "hidden" : "block"
            )}
          >
            Volunteer Coordinator
          </h2>
        </div>
        <nav className="flex flex-col space-y-1 w-full">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <item.icon
                className={cn("h-6 w-6", sidebarCollapsed ? "" : "mr-3")}
              />
              <span className={cn(sidebarCollapsed ? "hidden" : "block")}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
