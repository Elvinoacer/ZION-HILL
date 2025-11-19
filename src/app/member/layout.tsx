"use client";
import Image from "next/image";
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <Image
                src="/images/zion-hill.png"
                alt="Church Logo"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent ml-2 truncate">
                Zion Hill Worship Center, ELD
              </h1>
            </div>
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-2 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
