"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { safeFetch } from "@/lib/api";
import { intlFormat } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, UserMinus, Home, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Family {
  id: string;
  name: string;
  members: User[];
  createdBy: User;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

const FamilyPage = () => {
  const { data: session } = useSession();
  const [families, setFamilies] = useState<Family[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newFamilyName, setNewFamilyName] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [allFamilies, setAllFamilies] = useState<Family[]>([]);

  const getAllFamilies = useCallback(async function () {
    try {
      const allFamilies = await safeFetch("/api/all-families");
      if (Array.isArray(allFamilies)) setAllFamilies(allFamilies);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  }, []);

  const fetchUserFamilies = useCallback(async () => {
    try {
      if (!session?.user.id) return;
      const res = await fetch(`/api/family?userId=${session?.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch families");
      const data = await res.json();
      setFamilies(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, [session?.user.id]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUserFamilies();
    fetchUsers();
    getAllFamilies();
    setLoading(false);
  }, [fetchUserFamilies, getAllFamilies]);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newFamilyName.trim()) {
      setError("Family name cannot be empty.");
      toast.error("Family name cannot be empty.");
      return;
    }

    if (!session?.user.id) {
      toast.warning("Unauthorized request, please login!");
      return;
    }

    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFamilyName, member: session?.user }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create family");
      }

      setNewFamilyName("");
      fetchUserFamilies();
      toast.success("Family created successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedFamilyId || !selectedUserId) {
      setError("Please select both a family and a user.");
      toast.error("Please select both a family and a user.");
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${selectedUserId}&type=connect`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ familyId: selectedFamilyId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add family member");
      }

      setSelectedFamilyId("");
      setSelectedUserId("");
      fetchUserFamilies();
      toast.success("Family member added successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleRemoveFamilyMember = async (userId: string, familyId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/users?id=${userId}&type=remove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ familyId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove family member");
      }

      fetchUserFamilies();
      toast.success("Family member removed successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Skeleton className="h-10 w-64 mb-4 rounded-lg" />
            <Skeleton className="h-6 w-96 rounded-lg" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl shadow-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Family Management
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage family units and their members with ease
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Family */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-indigo-700 text-lg sm:text-xl font-bold">
                  <Home className="h-5 w-5" />
                  <span>Create New Family</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateFamily} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Family Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter family name"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      required
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Family
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Member to Family */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center space-x-2 text-purple-700 text-lg sm:text-xl font-bold">
                  <UserPlus className="h-5 w-5" />
                  <span>Add Family Member</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddFamilyMember} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Family
                    </label>
                    <Select
                      onValueChange={setSelectedFamilyId}
                      value={selectedFamilyId}
                    >
                      <SelectTrigger className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                        <SelectValue placeholder="Select a family" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg bg-white shadow-lg">
                        {families.map((family) => (
                          <SelectItem
                            key={family.id}
                            value={family.id}
                            className="text-sm sm:text-base"
                          >
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select User
                    </label>
                    <Select
                      onValueChange={setSelectedUserId}
                      value={selectedUserId}
                    >
                      <SelectTrigger className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg bg-white shadow-lg">
                        {users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            className="text-sm sm:text-base"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.photo} />
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {user.name} ({user.email})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Your Family Units */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-indigo-700 text-lg sm:text-xl font-bold">
                <Users className="h-5 w-5" />
                <span>Your Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {families.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {families.map((family) => (
                      <motion.div
                        key={family.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                              {family.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created by{" "}
                              {family.createdBy.id === session?.user.id
                                ? "you"
                                : family.createdBy.name}{" "}
                              on{" "}
                              {intlFormat(new Date(family.createdAt), {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                            {family.members.length} member
                            {family.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {family.members.length > 0 ? (
                          <ul className="space-y-2">
                            {family.members.map((member) => (
                              <motion.li
                                key={member.id}
                                whileHover={{
                                  x: 5,
                                  backgroundColor: "#f9fafb",
                                }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.photo} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-700 text-sm sm:text-base">
                                      {member.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={
                                    family.createdBy.id !== session?.user.id
                                  }
                                  onClick={() =>
                                    handleRemoveFamilyMember(
                                      member.id,
                                      family.id
                                    )
                                  }
                                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500 text-sm">
                            No members in this family yet
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No family units found.
                    {!session?.user.id && (
                      <span className="text-yellow-600">
                        {" "}
                        You need to be logged in
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Family Units */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-teal-700 text-lg sm:text-xl font-bold">
                <Users className="h-5 w-5" />
                <span>All Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {allFamilies.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {allFamilies.map((family) => (
                      <motion.div
                        key={family.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                              {family.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created by{" "}
                              {family.createdBy.id === session?.user.id
                                ? "you"
                                : family.createdBy.name}{" "}
                              on{" "}
                              {intlFormat(new Date(family.createdAt), {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-sm px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                            {family.members.length} member
                            {family.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {family.members.length > 0 ? (
                          <ul className="space-y-2">
                            {family.members.map((member) => (
                              <motion.li
                                key={member.id}
                                whileHover={{
                                  x: 5,
                                  backgroundColor: "#f9fafb",
                                }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.photo} />
                                    <AvatarFallback className="bg-teal-100 text-teal-600">
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-700 text-sm sm:text-base">
                                      {member.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={
                                    family.createdBy.id !== session?.user.id
                                  }
                                  onClick={() =>
                                    handleRemoveFamilyMember(
                                      member.id,
                                      family.id
                                    )
                                  }
                                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500 text-sm">
                            No members in this family yet
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No family units found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyPage;

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
`}</style>;
