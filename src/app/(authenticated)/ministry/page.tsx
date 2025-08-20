"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMinistryStore } from "@/store";
import { motion } from "framer-motion";
import { ChevronRight, Info, UserRound, Users } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading ministries...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md p-6 text-center bg-red-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-800">
            Error loading ministries
          </h3>
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchMinistries}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">
          Get Involved
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Ministries
          </span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Discover opportunities to connect, grow, and serve through our diverse
          church ministries.
        </p>
      </motion.div>

      {/* Ministries Grid */}
      {ministries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 space-y-4 bg-gray-50 rounded-xl"
        >
          <Users className="w-12 h-12 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-700">
            No ministries yet
          </h3>
          <p className="text-gray-500">
            Check back later or contact us to learn more
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ministries.map((ministry) => (
            <motion.div
              key={ministry.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  {ministry.photo ? (
                    <Image
                      src={ministry.photo}
                      alt={`${ministry.name} background`}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90"></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-white text-center px-4">
                      {ministry.name}
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 space-x-2 text-gray-500">
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
                  <p className="mb-6 text-gray-600 line-clamp-3">
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
                      className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Explore Ministry
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
