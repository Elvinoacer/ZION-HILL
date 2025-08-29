"use client";

import UserProfile from "@/components/UserProfile";
import FamilyMembers from "@/components/FamilyMembers";
import MembershipStatus from "@/components/MembershipStatus";
import { motion } from "framer-motion";
import { User, Users, Award } from 'lucide-react';

export default function ProfilePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 max-w-3xl text-lg text-gray-500 dark:text-gray-400">
            View and manage your personal information, family members, and membership status.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <UserProfile />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="mr-3 h-6 w-6 text-indigo-500"/>
                    Family Unit
                </h2>
                <FamilyMembers />
            </motion.div>
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="mr-3 h-6 w-6 text-amber-500"/>
                    Membership Details
                </h2>
                <MembershipStatus />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
