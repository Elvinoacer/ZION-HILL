"use client";
import { motion } from "framer-motion";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Church Administration
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
}
