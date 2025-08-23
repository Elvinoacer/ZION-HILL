"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSeniorPastorStore } from "@/store/seniorPastorStore";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  HeartPulse,
  Settings,
} from "lucide-react";

const navItems = [
  {
    href: "/senior-pastor",
    label: "Senior Pastor Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/admin-dashboard", label: "Admin Dashboard", icon: Settings },
  { href: "/baptism-candidates", label: "Baptism Candidates", icon: Users },
  {
    href: "/certificate-generator",
    label: "Certificate Generator",
    icon: FileText,
  },
  { href: "/certificates-view", label: "View Certificates", icon: Award },
  {
    href: "/pastoralcare/dashboard",
    label: "Pastoral Care Dashboard",
    icon: HeartPulse,
  },
];

export default function SeniorPastorSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileMenuOpen, closeMobileMenu } =
    useSeniorPastorStore();

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={closeMobileMenu}>
        <SheetContent side="left" className="w-64 p-0 pt-16 bg-gray-800">
          <SheetTitle id="senior-pastor-sidebar-title" className="sr-only">
            Senior Pastor Navigation
          </SheetTitle>
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href
                    ? "bg-blue-600 text-white"
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
            Senior Pastor
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
                  ? "bg-blue-600 text-white"
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
