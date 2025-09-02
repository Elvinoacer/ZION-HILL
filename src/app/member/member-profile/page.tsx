"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, DollarSign, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membersince?: string;
  birthdate?: string;
  photo?: string;
  transactions: {
    id: string;
    date: string;
    amount: number;
    description?: string;
  }[];
  shifts: {
    id: string;
    time: string;
    eventId: string;
    checkedIn: boolean;
    conflictCheck: boolean;
    replacementPool: string[];
  }[];
}

const MemberProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/member-profile?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        icon: <X className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  useEffect(() => {
    if (isEditing && profile) {
      const fields = [
        "name",
        "email",
        "phone",
        "address",
        "membersince",
        "birthdate",
        "photo",
      ];
      const filledFields = fields.filter(
        (field) => profile[field as keyof UserProfile]
      ).length;
      const progress = Math.round((filledFields / fields.length) * 100);
      setFormProgress(progress);
    }
  }, [profile, isEditing]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validateProfile = (profile: UserProfile | null): boolean => {
    if (!profile) return false;
    if (!profile.name || profile.name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast.error("Invalid email address.");
      return false;
    }
    if (profile.phone && !/^\+?\d{10,15}$/.test(profile.phone)) {
      toast.error("Invalid phone number format.");
      return false;
    }
    if (profile.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(profile.birthdate)) {
      toast.error("Invalid birthdate format (YYYY-MM-DD).");
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!profile || !session?.user?.id) return;

    if (!validateProfile(profile)) return;

    try {
      const res = await fetch(`/api/member-profile?userId=${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      setIsEditing(false);
      setIsModalOpen(true);
      fetchProfile();
      toast.success("Profile updated successfully!", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        icon: <X className="h-5 w-5 text-red-600" />,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Member Profile
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Loading profile...
            </p>
          </motion.div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Error
          </h1>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Member Profile
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              Please log in to view your profile.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800">Member Profile</h1>
          <p className="text-lg text-gray-600 mt-1">
            View and manage your profile information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-700">
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-800 text-base">{profile?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-800 text-base">{profile?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-800 text-base">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Address</p>
                    <p className="text-gray-800 text-base">
                      {profile?.address || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Member Since</p>
                    <p className="text-gray-800 text-base">
                      {profile?.membersince
                        ? format(new Date(profile.membersince), "MMMM d, yyyy")
                        : "Not available"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Birthdate</p>
                    <p className="text-gray-800 text-base">
                      {profile?.birthdate
                        ? format(new Date(profile.birthdate), "MMMM d, yyyy")
                        : "Not provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Giving History Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-700">
                    Giving History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.transactions && profile.transactions.length > 0 ? (
                    <ul className="space-y-4">
                      {profile.transactions.map((transaction) => (
                        <li
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-2 rounded-full">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {transaction.description || "Donation"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {format(
                                  new Date(transaction.date),
                                  "MMMM d, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-lg text-green-700">
                            KES {transaction.amount.toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No giving history found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <CardContent className="p-8">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={profile?.photo} />
                    <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                      {profile?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile?.name}
                  </h2>
                  <p className="text-gray-500">{profile?.email}</p>
                  <Button
                    onClick={() => router.push('/member/profile')}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Volunteer Schedule Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-700">
                    Volunteer Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.shifts && profile.shifts.length > 0 ? (
                    <ul className="space-y-4">
                      {profile.shifts.map((shift) => (
                        <li
                          key={shift.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {shift.time}
                              </p>
                              <p className="text-sm text-gray-500">
                                Event ID: {shift.eventId}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              shift.checkedIn
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {shift.checkedIn ? "Checked In" : "Pending"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No volunteer schedules found.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
