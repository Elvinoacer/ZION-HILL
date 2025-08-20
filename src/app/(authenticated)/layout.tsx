"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiInfo, FiMail, FiMenu, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              ChurchConnect
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/profile"
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
