"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import GivingDashboard from "@/components/GivingDashboard";
import { Loader } from 'lucide-react';

const MemberGivingPageContent = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="max-w-7xl mx-auto mt-8">
        <GivingDashboard />
      </main>
    </div>
  );
};

const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-12"
  >
    <Handshake className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400 mb-3 sm:mb-4" />
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Your Giving</h1>
    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
      Manage your tithes, offerings, and view your giving history.
    </p>
  </motion.header>
);

const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <Loader className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-500 dark:text-blue-400 animate-spin" />
        <p className="text-base sm:text-lg">Loading Giving Information...</p>
      </div>
    </div>
  );

const MemberGivingPage = () => (
  <Suspense fallback={<LoadingState />}>
    <MemberGivingPageContent />
  </Suspense>
);

export default MemberGivingPage;
