"use client";

import { useState } from "react";
import EventsManagerSidebar from "@/components/events_manager/EventsManagerSidebar";
import EventsManagerHeader from "@/components/events_manager/EventsManagerHeader";
import { useSession } from "next-auth/react";

export default function EventsManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes("EVENTS_MANAGER");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {hasRequiredRole && (
        <EventsManagerSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <EventsManagerHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
