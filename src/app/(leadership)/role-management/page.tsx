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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
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
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (roleFilter === "all") return matchesSearch;
    return matchesSearch && user.roles.includes(roleFilter);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Shield className="absolute top-3 left-3 h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            Loading users and roles...
          </p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserCog className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Role Management
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Assign, update, and revoke user roles and permissions across the
              platform with precision and control.
            </p>
          </header>

          <main className="space-y-8">
            {/* Assign Role Card */}
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50 pb-3">
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
                      <SelectContent>
                        {allUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
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
                              {role.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end bg-muted/30">
                <Button
                  onClick={handleRoleChange}
                  disabled={!selectedUser || !selectedRole}
                  className="gap-2"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Assign/Update Role
                </Button>
              </CardFooter>
            </Card>

            {/* Users with Privileged Roles Card */}
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-100/50">
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                  Users with Privileged Roles
                </CardTitle>
                <CardDescription>
                  List of all users with roles other than MEMBER or GUEST.
                </CardDescription>
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
                </div>

                {filteredUsers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-semibold">User</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Roles</TableHead>
                          <TableHead className="text-right font-semibold">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="group hover:bg-muted/30"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                {user.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map((role) => (
                                  <Badge
                                    key={role}
                                    variant={
                                      role === "ADMIN" ? "default" : "secondary"
                                    }
                                    className="gap-1"
                                  >
                                    <Shield className="h-3 w-3" />
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {user.roles.map((role) => (
                                  <Button
                                    key={role}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRevokeRole(user.id, role)
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <div className="mx-auto bg-muted/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">
                      No privileged users found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery || roleFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Users with privileged roles will appear here"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
};

export default RoleManagementPage;
