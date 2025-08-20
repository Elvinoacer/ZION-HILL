"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="mx-auto w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mb-6"
        />

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Loading Content
        </h2>
        <p className="text-gray-600 mb-6">
          Please wait while we prepare your experience
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
