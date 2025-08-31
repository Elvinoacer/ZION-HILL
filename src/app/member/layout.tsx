"use client";
import { churchConfig } from "@/lib/church-config";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import React from "react";
import { FiMenu } from "react-icons/fi";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRequiredRole = userRoles.includes("MEMBER");

  return (
    <div className="flex h-screen bg-gray-100">
      {hasRequiredRole && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800 ml-4">
              {churchConfig.name}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/member/profile"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <img
                className="w-[30px] h-[30px] rounded-full"
                src={session?.user.photo}
                alt={session?.user.name}
              />
            </a>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
