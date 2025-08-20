"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-8">
          <motion.h1
            className="text-9xl font-bold text-indigo-600 mb-4"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            404
          </motion.h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/"
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Return Home
          </Link>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <a href="/contact" className="text-indigo-600 hover:underline">
              Contact us
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
