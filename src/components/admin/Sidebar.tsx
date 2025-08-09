"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ministries } from "@/lib/constants";

const itemVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg"
      aria-label="Ministry navigation"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">Ministry Dashboard</h2>
      </div>
      <nav className="mt-6">
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
    </motion.aside>
  );
}
