"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMinistryStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function MinistryPage() {
  const { ministries, loading, error, fetchMinistries } = useMinistryStore();

  useEffect(() => {
    fetchMinistries();
  }, [fetchMinistries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-12 w-12 text-indigo-600" />
          <p className="text-sm sm:text-base font-medium text-gray-600">
            Loading ministries...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-red-800">
            Error Loading Ministries
          </h3>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <Button
            onClick={fetchMinistries}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1 mb-4 text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full shadow-sm">
            Get Involved
          </div>
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Ministries
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
            Discover opportunities to connect, grow, and serve through our
            vibrant and diverse church ministries.
          </p>
        </motion.div>

        {/* Ministries Grid */}
        {ministries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <Users className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-700">
              No Ministries Available
            </h3>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              We're working on adding new ministries. Check back soon or contact
              us to learn more!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {ministries.map((ministry) => (
                <motion.div
                  key={ministry.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      {ministry.photo ? (
                        <Image
                          src={ministry.photo}
                          alt={`${ministry.name} background`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90"></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <h2 className="text-xl sm:text-2xl font-bold text-white text-center px-4 line-clamp-2">
                          {ministry.name}
                        </h2>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3 space-x-2 text-gray-500">
                        <UserRound className="w-4 h-4" />
                        <span className="text-sm">
                          {ministry.leader?.name || "Leader not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center mb-4 space-x-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {ministry?._count?.members || 0} members
                        </span>
                      </div>
                      <p className="mb-6 text-sm text-gray-600 line-clamp-3">
                        {ministry.description ||
                          "Join us in serving and growing together."}
                      </p>
                      <Link
                        href={`/ministry/${ministry.id}`}
                        passHref
                        aria-label={`Learn more about ${ministry.name}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                          Explore Ministry
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
