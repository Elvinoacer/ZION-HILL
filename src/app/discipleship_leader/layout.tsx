"use client";

import { useState } from "react";
import DiscipleshipSidebar from "@/components/discipleship_leader/DiscipleshipSidebar";
import DiscipleshipHeader from "@/components/discipleship_leader/DiscipleshipHeader";
import { useSession } from "next-auth/react";

export default function DiscipleshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes("DISCIPLESHIP_LEADER");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {hasRequiredRole && (
        <DiscipleshipSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DiscipleshipHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
