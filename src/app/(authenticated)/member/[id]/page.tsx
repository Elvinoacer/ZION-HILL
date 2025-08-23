"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  membersince: string | null;
  birthdate: string | null;
  photo: string | null;
  roles: string[];
  christian: boolean | null;
  createdAt: string;
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/profile?id=${id}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch user");
          }
          const data = await res.json();
          setUser(data);
        } catch (err: any) {
          setError(err.message);
          toast.error(err.message, {
            icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-16 w-16 text-indigo-600" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading profile...
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
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Error
          </h1>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md px-4 py-2 transition-transform transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-gray-100 p-4 rounded-full mb-4">
            <UserIcon className="h-6 w-6 text-gray-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            User Not Found
          </h1>
          <p className="text-sm text-gray-600">
            The requested user profile could not be found.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl py-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mb-4 ring-4 ring-indigo-100">
                <AvatarImage
                  src={user.image || user.photo || undefined}
                  alt={user.name || "User Avatar"}
                />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
              {user.name || "Unknown User"}
            </CardTitle>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <AnimatePresence>
                {user.roles.map((role, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 font-medium text-xs sm:text-sm px-3 py-1"
                    >
                      {role}
                    </Badge>
                  </motion.div>
                ))}
                {user.christian && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: user.roles.length * 0.1,
                    }}
                  >
                    <Badge className="bg-blue-600 text-white font-medium text-xs sm:text-sm px-3 py-1">
                      Christian
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {user.email && (
              <motion.div
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <Mail className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">{user.email}</p>
              </motion.div>
            )}
            {user.phone && (
              <motion.div
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ x: 5 }}
              >
                <Phone className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">{user.phone}</p>
              </motion.div>
            )}
            {user.address && (
              <motion.div
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ x: 5 }}
              >
                <MapPin className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">{user.address}</p>
              </motion.div>
            )}
            {user.membersince && (
              <motion.div
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <CalendarDays className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  Member Since:{" "}
                  {format(new Date(user.membersince), "MMMM d, yyyy")}
                </p>
              </motion.div>
            )}
            {user.birthdate && (
              <motion.div
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ x: 5 }}
              >
                <CalendarDays className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  Born: {format(new Date(user.birthdate), "MMMM d, yyyy")}
                </p>
              </motion.div>
            )}
            <motion.div
              className="text-xs sm:text-sm text-gray-500 text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Joined: {format(new Date(user.createdAt), "MMMM d, yyyy")}
            </motion.div>
          </CardContent>
        </Card>
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
};

export default UserProfilePage;
