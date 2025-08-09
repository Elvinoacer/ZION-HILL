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
      return;
    }

    if (!session?.user.id) {
      toast.warning("Unauthorized request, please login!");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Family Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage family units and their members with ease
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Family */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-700">
                  <Home className="h-5 w-5" />
                  <span>Create New Family</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Family
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Member to Family */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-700">
                  <UserPlus className="h-5 w-5" />
                  <span>Add Family Member</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFamilyMember} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Family
                    </label>
                    <Select
                      onValueChange={setSelectedFamilyId}
                      value={selectedFamilyId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a family" />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map((family) => (
                          <SelectItem key={family.id} value={family.id}>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.photo} />
                                <AvatarFallback>
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
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <Users className="h-5 w-5" />
                <span>Your Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {families.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {families.map((family) => (
                      <motion.div
                        key={family.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-lg bg-white shadow-xs border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {family.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created by{" "}
                              {family.createdBy.id === session?.user.id
                                ? "you"
                                : family.createdBy.name}{" "}
                              on {intlFormat(family.createdAt)}
                            </p>
                          </div>
                          <div className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                            {family.members.length} member
                            {family.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {family.members.length > 0 ? (
                          <ul className="space-y-2">
                            {family.members.map((member) => (
                              <motion.li
                                key={member.id}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={member.photo} />
                                    <AvatarFallback>
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-700">
                                      {member.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
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
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
                            No members in this family yet
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">
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
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-white to-teal-50 border border-teal-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-teal-700">
                <Users className="h-5 w-5" />
                <span>All Family Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allFamilies.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {allFamilies.map((family) => (
                      <motion.div
                        key={family.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-lg bg-white shadow-xs border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {family.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created by{" "}
                              {family.createdBy.id === session?.user.id
                                ? "you"
                                : family.createdBy.name}{" "}
                              on {intlFormat(family.createdAt)}
                            </p>
                          </div>
                          <div className="text-sm px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                            {family.members.length} member
                            {family.members.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        {family.members.length > 0 ? (
                          <ul className="space-y-2">
                            {family.members.map((member) => (
                              <motion.li
                                key={member.id}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={member.photo} />
                                    <AvatarFallback>
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-700">
                                      {member.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
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
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
                            No members in this family yet
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No family units found.</p>
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
