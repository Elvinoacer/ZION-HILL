'use client';

import { useState } from 'react';
import CommunicationsSidebar from '@/components/communications_officer/CommunicationsSidebar';
import CommunicationsHeader from '@/components/communications_officer/CommunicationsHeader';

export default function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CommunicationsSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CommunicationsHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
