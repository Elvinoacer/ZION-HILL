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
import { Users, UserPlus, UserMinus, Home, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewFamilyMembersModal } from "@/components/ViewFamilyMembersModal";
import { User } from "@/generated/prisma";

interface Family {
  id: string;
  name: string;
  members: User[];
  createdBy: User;
  createdAt: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [familiesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredFamilies = allFamilies.filter((family) =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastFamily = currentPage * familiesPerPage;
  const indexOfFirstFamily = indexOfLastFamily - familiesPerPage;
  const currentFamilies = filteredFamilies.slice(
    indexOfFirstFamily,
    indexOfLastFamily
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
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
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <UserMinus className="h-6 w-6 text-red-600" />
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
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
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 text-lg sm:text-xl font-bold">
                  <Home className="h-5 w-5 text-indigo-600" />
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
                      className="rounded-lg border-gray-300 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
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
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 text-lg sm:text-xl font-bold">
                  <UserPlus className="h-5 w-5 text-purple-600" />
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
                      <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 text-sm sm:text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
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
                      <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 text-sm sm:text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
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
                                <AvatarImage src={user.photo ?? ""} />
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {user.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate">{user.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 text-lg sm:text-xl font-bold">
                <Users className="h-5 w-5 text-indigo-600" />
                <span>Your Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
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
                        className="p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex-grow">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
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
                          <div className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium self-start sm:self-center">
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
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-white border border-gray-100 shadow-sm gap-3"
                              >
                                <div className="flex items-center space-x-3 flex-grow">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.photo ?? ""} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                      {member.name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-grow">
                                    <p className="font-medium text-gray-700 text-sm sm:text-base truncate">
                                      {member.name}
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
                                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  <span className="sm:inline">Remove</span>
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 text-lg sm:text-xl font-bold">
                <Users className="h-5 w-5 text-teal-600" />
                <span>All Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for a family..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg border-gray-300 bg-gray-50 text-sm sm:text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                  />
                </div>
              </div>
              {filteredFamilies.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {currentFamilies.map((family) => (
                      <motion.div
                        key={family.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex-grow">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                              {family.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={family.createdBy.photo ?? ""}
                                />
                                <AvatarFallback className="bg-teal-100 text-teal-600">
                                  {family.createdBy.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                Created by{" "}
                                {family.createdBy.id === session?.user.id
                                  ? "you"
                                  : family.createdBy.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-medium self-start sm:self-center">
                              {family.members.length} member
                              {family.members.length !== 1 ? "s" : ""}
                            </div>
                            <ViewFamilyMembersModal
                              members={family.members}
                              familyName={family.name}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredFamilies.length > familiesPerPage && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      <Button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of{" "}
                        {Math.ceil(filteredFamilies.length / familiesPerPage)}
                      </span>
                      <Button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredFamilies.length / familiesPerPage)
                        }
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                  )}
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
