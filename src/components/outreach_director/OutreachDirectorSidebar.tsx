"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOutreachDirectorStore } from "@/store/outreachDirectorStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Compass, LayoutDashboard, Menu, X } from "lucide-react";

const navItems = [
  { href: "/outreach", label: "Outreach Programs", icon: Compass },
  {
    href: "/outreach-director",
    label: "(Future Director Dashboard)",
    icon: LayoutDashboard,
  },
];

export default function OutreachDirectorSidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    mobileMenuOpen,
    closeMobileMenu,
    toggleMobileMenu,
  } = useOutreachDirectorStore();

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent side="left" className="w-64 p-0 pt-16 bg-gray-800">
          {" "}
          {/* Added bg-gray-800 */}
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white" // Adjusted colors
                )}
                onClick={closeMobileMenu} // Close on selection for mobile
              >
                <item.icon className="h-6 w-6 mr-3" /> {/* Render icon */}
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gray-800 border-r border-gray-700 h-screen sticky top-0 p-4 transition-all duration-300", // Changed background and border
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
            {" "}
            {/* Changed text color */}
            Outreach Director
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
                  : "text-gray-300 hover:bg-gray-700 hover:text-white", // Adjusted colors
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <item.icon
                className={cn("h-6 w-6", sidebarCollapsed ? "" : "mr-3")}
              />{" "}
              {/* Render icon */}
              <span className={cn(sidebarCollapsed ? "hidden" : "block")}>
                {" "}
                {/* Hide label when collapsed */}
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
