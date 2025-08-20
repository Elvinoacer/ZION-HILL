"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-8">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>

          <h1 className="text-4xl font-bold text-rose-800 mt-4 mb-2">
            Something went wrong!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {error.message || "An unexpected error occurred"}
          </p>
          <p className="text-gray-600 mb-6">
            Don&apos;t worry, our team has been notified. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => reset()}
            className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg shadow hover:bg-rose-700 transition-colors"
          >
            Try Again
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-rose-600 font-medium rounded-lg shadow hover:bg-gray-50 transition-colors border border-rose-200"
            >
              Return Home
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 text-sm text-rose-800 bg-rose-100/50 p-3 rounded-lg">
          <p>Error details: {error.digest || "No additional details"}</p>
        </div>
      </motion.div>
    </div>
  );
}
