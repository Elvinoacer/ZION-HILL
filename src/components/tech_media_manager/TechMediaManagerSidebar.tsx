"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTechMediaManagerStore } from "@/store/techMediaManagerStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, Monitor, Globe } from "lucide-react";

const navItems = [
  { href: "/tech_media_manager/DigitalHubDashboard", label: "Digital Hub Dashboard", icon: Monitor },
  { href: "/tech_media_manager", label: "Tech & Media Manager", icon: LayoutDashboard },
];

export default function TechMediaManagerSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileMenuOpen, closeMobileMenu } = useTechMediaManagerStore();

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
                    ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg" /* Dark theme active link */
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white", /* Dark theme inactive link */
                  "transition-all duration-200"
                )}
                onClick={closeMobileMenu}
              >
                <item.icon className="h-6 w-6 mr-3 text-blue-300" /> {/* Dark theme icon color */}
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
          <h2 className={cn("text-lg font-semibold text-white", sidebarCollapsed ? "hidden" : "block")}>
            Tech & Media
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
                  ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg" /* Dark theme active link */
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white", /* Dark theme inactive link */
                sidebarCollapsed ? "justify-center" : "",
                "transition-all duration-200"
              )}
            >
              <item.icon className={cn("h-6 w-6", sidebarCollapsed ? "" : "mr-3", "text-blue-300")} /> {/* Dark theme icon color */}
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
