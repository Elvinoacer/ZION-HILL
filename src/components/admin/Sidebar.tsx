"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ministries } from "@/lib/constants";
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";
import { useState } from "react";

const itemVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export default function Sidebar() {
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg flex flex-col"
      aria-label="Ministry navigation"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">Ministry Dashboard</h2>
      </div>
      <nav className="mt-6 flex-grow">
        <ul className="space-y-2 px-4">
          {ministries.map((ministry) => (
            <motion.li
              key={ministry.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/admin/dashboard/${encodeURIComponent(ministry.id)}`}
                className="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="mr-3">{ministry.icon}</span>
                <span>{ministry.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center border-2 border-blue-600 overflow-hidden flex-shrink-0">
            {session?.user?.photo ? (
              <img
                src={session.user.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-400 text-4xl" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="font-semibold text-white truncate">
              {session?.user?.name || "Guest"}
            </div>
            <div className="text-xs text-gray-400 capitalize truncate">
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
      <AlertDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will be returned to the login page."
      />
    </motion.aside>
  );
}
