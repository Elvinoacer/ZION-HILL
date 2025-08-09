// components/dashboard/UserMenu.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = {
    name: "John Doe",
    email: "john@church.org",
    role: "Worship Leader",
    avatar: "/default-avatar.png", // Replace with your default avatar path
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600">
          <Image
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <span className="hidden md:inline-block font-medium text-gray-700">
          {user.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1 px-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            <div className="py-1">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Notifications
              </a>
            </div>
            <div className="py-1 border-t border-gray-100">
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
