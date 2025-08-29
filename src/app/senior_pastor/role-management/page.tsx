"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  AlertCircle,
  Loader2,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  Key,
  Search,
  Filter,
  Shield,
  UserCog,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

const RoleManagementPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showRoleDescriptions, setShowRoleDescriptions] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const fetchUsersAndRoles = async () => {
    setLoading(true);
    try {
      const [allUsersRes, rolesRes] = await Promise.all([
        fetch("/api/users/all-with-roles"),
        fetch("/api/roles"),
      ]);

      if (!allUsersRes.ok) throw new Error("Failed to fetch users");
      if (!rolesRes.ok) throw new Error("Failed to fetch roles");

      const allUsersData = await allUsersRes.json();
      const rolesData = await rolesRes.json();

      setAllUsers(allUsersData);
      setRoles(rolesData);

      const privilegedUsers = allUsersData.filter(
        (user: User) =>
          user.roles &&
          user.roles.length > 0 &&
          !user.roles.every((role) => ["MEMBER", "GUEST"].includes(role))
      );
      setUsers(privilegedUsers);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load data.", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const res = await fetch("/api/users/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          roleName: selectedRole,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      toast.success(
        `Role '${selectedRole}' assigned to ${selectedUser.name} successfully.`
      );
      setSelectedUser(null);
      setSelectedRole(null);
      fetchUsersAndRoles();
    } catch (err: any) {
      setError(err.message);
      toast.error("Update Failed", { description: err.message });
    }
  };

  const handleRevokeRole = async (userId: string, roleName: string) => {
    setIsRevoking(`${userId}-${roleName}`);
    try {
      const res = await fetch("/api/users/revoke-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to revoke user role");
      }

      toast.success(`Role '${roleName}' revoked successfully.`);
      fetchUsersAndRoles();
    } catch (err: any) {
      setError(err.message);
      toast.error("Revoke Failed", { description: err.message });
    } finally {
      setIsRevoking(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (roleFilter === "all") return matchesSearch;
    return matchesSearch && user.roles.includes(roleFilter);
  });

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-800 border-red-200",
    MODERATOR: "bg-blue-100 text-blue-800 border-blue-200",
    CONTENT_CREATOR: "bg-purple-100 text-purple-800 border-purple-200",
    FINANCE: "bg-green-100 text-green-800 border-green-200",
    PRAYER_MANAGER: "bg-indigo-100 text-indigo-800 border-indigo-200",
    MEMBER: "bg-gray-100 text-gray-800 border-gray-200",
    GUEST: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return <ShieldAlert className="h-3 w-3" />;
      case "MODERATOR":
        return <UserCog className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Error Loading Data
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={fetchUsersAndRoles}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
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
                <UserCog className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Role Management
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage user roles and permissions
                </p>
              </div>
            </div>
          </motion.header>

          <main className="space-y-8">
            {/* Stats Overview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
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
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {allUsers.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <ShieldAlert className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Privileged Users
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {users.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <Key className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Available Roles
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {roles.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <div className="rounded-full bg-amber-100 p-3 mr-4">
                    <UserCog className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Admin Users
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {users.filter((u) => u.roles.includes("ADMIN")).length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Assign Role Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 p-6">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <UserPlus className="h-6 w-6" />
                    Assign or Change User Role
                  </CardTitle>
                  <CardDescription>
                    Select a user and a new role to assign. This will override
                    their current primary role if applicable.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Select User
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedUser(
                            allUsers.find((user) => user.id === value) || null
                          )
                        }
                        value={selectedUser?.id || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Search for a user..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {allUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex flex-col">
                                <span className="font-semibold">
                                  {user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                                {user.roles.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {user.roles.map((role) => (
                                      <Badge
                                        key={role}
                                        variant="outline"
                                        className={`text-xs ${
                                          roleColors[role] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Select Role
                      </label>
                      <Select
                        onValueChange={(value) => setSelectedRole(value)}
                        value={selectedRole || ""}
                        disabled={!selectedUser}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium">{role.name}</div>
                                  {role.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {role.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/30 p-6">
                  <Button
                    onClick={handleRoleChange}
                    disabled={!selectedUser || !selectedRole}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Assign/Update Role
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Users with Privileged Roles Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                        Users with Privileged Roles
                      </CardTitle>
                      <CardDescription>
                        List of all users with roles other than MEMBER or GUEST.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchUsersAndRoles}
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
                          {roles
                            .filter(
                              (role) => !["MEMBER", "GUEST"].includes(role.name)
                            )
                            .map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowRoleDescriptions(!showRoleDescriptions)
                      }
                      className="gap-2"
                    >
                      {showRoleDescriptions ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hide Descriptions
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Show Descriptions
                        </>
                      )}
                    </Button>
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
                                Email
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
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {user.name}
                                      </div>
                                      {showRoleDescriptions && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          User ID: {user.id}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground">
                                  {user.email}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex flex-wrap gap-2">
                                    {user.roles.map((role) => (
                                      <Badge
                                        key={role}
                                        variant="outline"
                                        className={`gap-1 ${
                                          roleColors[role] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {getRoleIcon(role)}
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    {user.roles.map((role) => (
                                      <Button
                                        key={role}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRevokeRole(user.id, role)
                                        }
                                        disabled={
                                          isRevoking === `${user.id}-${role}`
                                        }
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 transition-all"
                                      >
                                        {isRevoking === `${user.id}-${role}` ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4" />
                                        )}
                                        Revoke
                                      </Button>
                                    ))}
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
                        No privileged users found
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery || roleFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Users with privileged roles will appear here"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Role Reference Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 p-6">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-6 w-6 text-primary" />
                    Role Reference Guide
                  </CardTitle>
                  <CardDescription>
                    Understanding the different user roles and their permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="border rounded-lg p-4 bg-gray-50/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              roleColors[role.name] || "bg-gray-100"
                            }`}
                          >
                            {getRoleIcon(role.name)}
                          </div>
                          <h4 className="font-semibold">{role.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {role.description || "No description available."}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RoleManagementPage;
