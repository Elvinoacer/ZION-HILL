"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Cake,
  Image,
  Key,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Search,
  Filter,
  Shield,
  RefreshCw,
  UserPlus,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membersince?: string;
  birthdate?: string;
  photo?: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    membersince: "",
    birthdate: "",
    photo: "",
    roleIds: [] as number[],
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRoles()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleNewUserRoleChange = (value: string) => {
    setNewUser((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(parseInt(value))
        ? prev.roleIds.filter((id) => id !== parseInt(value))
        : [...prev.roleIds, parseInt(value)],
    }));
  };

  const handleEditingUserRoleChange = (value: string) => {
    setEditingUser((prev) => {
      if (!prev) return null;
      const roleName = roles.find((role) => String(role.id) === value)?.name;
      if (!roleName) return prev;

      const updatedRoles = prev.roles.some((role) => role.name === roleName)
        ? prev.roles.filter((role) => role.name !== roleName)
        : [...prev.roles, { id: parseInt(value), name: roleName }];

      return {
        ...prev,
        roles: updatedRoles,
      };
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
          address: newUser.address,
          membersince: newUser.membersince,
          birthdate: newUser.birthdate,
          photo: newUser.photo,
          roles: newUser.roleIds
            .map((id) => roles.find((r) => r.id === id)?.name)
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        membersince: "",
        birthdate: "",
        photo: "",
        roleIds: [],
      });
      fetchUsers();
      setActiveTab("users");
      toast.success("User added successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users?id=${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          address: editingUser.address,
          membersince: editingUser.membersince,
          birthdate: editingUser.birthdate,
          photo: editingUser.photo,
          roles: editingUser.roles
            .map((role) => role.name || "")
            .filter((name) => name !== ""),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setEditingUser(null);
      fetchUsers();
      toast.success("User updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      fetchUsers();
      toast.success("User deleted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.roles.some((role) => role.name === roleFilter);

    return matchesSearch && matchesRole;
  });

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-800 border-red-200",
    MODERATOR: "bg-blue-100 text-blue-800 border-blue-200",
    MEMBER: "bg-green-100 text-green-800 border-green-200",
    GUEST: "bg-gray-100 text-gray-800 border-gray-200",
    CONTENT_CREATOR: "bg-purple-100 text-purple-800 border-purple-200",
    FINANCE: "bg-amber-100 text-amber-800 border-amber-200",
    PRAYER_MANAGER: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.roles.some((r) => r.name === "ADMIN")).length,
    members: users.filter((u) => u.roles.some((r) => r.name === "MEMBER"))
      .length,
    guests: users.filter((u) => u.roles.some((r) => r.name === "GUEST")).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage church users, their profiles, and roles.
              </p>
            </div>
          </div>
        </motion.header>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.admins}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Members</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.members}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-gray-100 p-3 mr-4">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Guests</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.guests}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-white rounded-lg py-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="addUser"
              className="data-[state=active]:bg-white rounded-lg py-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {editingUser ? "Edit User" : "Add User"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        User Directory
                      </CardTitle>
                      <CardDescription>
                        Manage all church users and their roles
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchUsers}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {filteredUsers.length > 0 ? (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="font-semibold py-4">
                                User
                              </TableHead>
                              <TableHead className="font-semibold py-4">
                                Contact
                              </TableHead>
                              <TableHead className="font-semibold py-4">
                                Member Since
                              </TableHead>
                              <TableHead className="font-semibold py-4">
                                Roles
                              </TableHead>
                              <TableHead className="text-right font-semibold py-4">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow
                                key={user.id}
                                className="group hover:bg-gray-50/50 transition-colors"
                              >
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {user.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ID: {user.id}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Mail className="h-3 w-3" />
                                      {user.email}
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                        <Phone className="h-3 w-3" />
                                        {user.phone}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  {user.membersince ? (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        user.membersince
                                      ).toLocaleDateString()}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      Not specified
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                      <Badge
                                        key={role.id}
                                        variant="outline"
                                        className={`gap-1 ${
                                          roleColors[role.name] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        <Shield className="h-3 w-3" />
                                        {role.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingUser({
                                          ...user,
                                          phone: user.phone || "",
                                          address: user.address || "",
                                          membersince: user.membersince || "",
                                          birthdate: user.birthdate || "",
                                          photo: user.photo || "",
                                          roles: user.roles || [],
                                        });
                                        setActiveTab("addUser");
                                      }}
                                      className="gap-1"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="gap-1"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                      <div className="mx-auto bg-gray-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-lg mb-1 text-gray-900">
                        No users found
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery || roleFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "No users have been added yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="addUser">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 p-6">
                  <CardTitle className="flex items-center gap-2">
                    {editingUser ? (
                      <>
                        <Edit className="h-6 w-6 text-primary" />
                        Edit User
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-6 w-6 text-primary" />
                        Add New User
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {editingUser
                      ? `Update ${editingUser.name}'s details`
                      : "Create a new user account for your church community"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form
                    onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={editingUser ? editingUser.name : newUser.name}
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={editingUser ? editingUser.email : newUser.email}
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                        required
                        placeholder="Enter email address"
                      />
                    </div>
                    {!editingUser && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Password *
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                            required
                            placeholder="Create a password"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </label>
                      <Input
                        type="text"
                        name="phone"
                        value={
                          editingUser ? editingUser.phone || "" : newUser.phone
                        }
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={
                          editingUser
                            ? editingUser.address || ""
                            : newUser.address
                        }
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </label>
                      <Input
                        type="date"
                        name="membersince"
                        value={
                          editingUser
                            ? editingUser.membersince || ""
                            : newUser.membersince
                        }
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Cake className="h-4 w-4" />
                        Birthdate
                      </label>
                      <Input
                        type="date"
                        name="birthdate"
                        value={
                          editingUser
                            ? editingUser.birthdate || ""
                            : newUser.birthdate
                        }
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Photo URL
                      </label>
                      <Input
                        type="text"
                        name="photo"
                        value={
                          editingUser ? editingUser.photo || "" : newUser.photo
                        }
                        onChange={
                          editingUser
                            ? handleEditingUserChange
                            : handleNewUserChange
                        }
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Roles
                      </label>
                      <Select
                        onValueChange={
                          editingUser
                            ? handleEditingUserRoleChange
                            : handleNewUserRoleChange
                        }
                        value={
                          editingUser
                            ? String(editingUser.roles[0]?.id || "")
                            : String(newUser.roleIds[0] || "")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select roles" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    roleColors[role.name]?.split(" ")[0] ||
                                    "bg-gray-300"
                                  }`}
                                ></div>
                                {role.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {editingUser ? (
                          <>
                            <Edit className="h-4 w-4" />
                            Update User
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Add User
                          </>
                        )}
                      </Button>
                      {editingUser && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null);
                            setActiveTab("users");
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUsersPage;
