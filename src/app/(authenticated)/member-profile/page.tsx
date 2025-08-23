"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Save, X, User, Calendar, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

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
  shifts: { id: string; time: string; eventId: string; checkedIn: boolean }[];
}

const MemberProfilePage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Member Profile
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Manage your personal information, view your giving history, and
            check your volunteer schedules.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-indigo-700 text-lg sm:text-xl font-bold">
                <User className="h-5 w-5" />
                <span>Your Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {profile ? (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.photo} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Profile Completion
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {formProgress}%
                        </span>
                      </div>
                      <Progress
                        value={formProgress}
                        className="h-2 bg-gray-100"
                      />
                    </div>
                  )}
                  <form
                    onSubmit={handleUpdateProfile}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone
                      </label>
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="membersince"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Member Since
                      </label>
                      <Input
                        type="text"
                        id="membersince"
                        name="membersince"
                        value={profile.membersince || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthdate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Birthdate
                      </label>
                      <Input
                        type="text"
                        id="birthdate"
                        name="birthdate"
                        value={profile.birthdate || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="YYYY-MM-DD"
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Photo URL
                      </label>
                      <Input
                        type="text"
                        id="photo"
                        name="photo"
                        value={profile.photo || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-2 mt-4">
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              fetchProfile();
                            }}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  No profile data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg sm:text-xl font-bold">
                <DollarSign className="h-5 w-5" />
                <span>Giving History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {profile?.transactions && profile.transactions.length > 0 ? (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {profile.transactions.map((transaction) => (
                      <motion.li
                        key={transaction.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-700">
                            {format(new Date(transaction.date), "MMMM d, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.description || "Donation"}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-blue-600">
                          ${transaction.amount.toFixed(2)}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    No giving history available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-purple-700 text-lg sm:text-xl font-bold">
                <Calendar className="h-5 w-5" />
                <span>Volunteer Schedules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {profile?.shifts && profile.shifts.length > 0 ? (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {profile.shifts.map((shift) => (
                      <motion.li
                        key={shift.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-700">
                            {shift.time}
                          </p>
                          <p className="text-xs text-gray-500">
                            Event ID: {shift.eventId}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            shift.checkedIn
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {shift.checkedIn ? "Checked In" : "Pending"}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    No volunteer schedules available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span>Profile Updated</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    Your profile has been successfully updated.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>

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

export default MemberProfilePage;
