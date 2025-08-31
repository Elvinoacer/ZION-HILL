"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility is available
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";

const navItems = [
  { href: "/outreach_director/outreach", label: "Outreach Programs" },
  { href: "/outreach_director/outreach-director", label: "Outreach Director Dashboard" },
];

export function OutreachDirectorSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 p-4">Outreach Director</h2>
      <nav className="flex flex-col space-y-1 flex-grow p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setIsOpen(false)} // Close on selection for mobile
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden flex-shrink-0">
            {session?.user?.photo ? (
              <img
                src={session.user.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-500 text-4xl" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="font-semibold text-foreground truncate">
              {session?.user?.name || "Guest"}
            </div>
            <div className="text-xs text-muted-foreground capitalize truncate">
              {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                "Public User"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-center mt-4 p-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-400 transition-all"
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r h-screen sticky top-0">
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
