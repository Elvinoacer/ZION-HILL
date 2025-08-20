"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // Assuming roles are strings for now, will map to RoleName enum
}

interface Role {
  id: number;
  name: string;
}

const RoleManagementPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]); // New state for all users
  const [users, setUsers] = useState<User[]>([]); // Existing state for privileged users
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const fetchUsersAndRoles = async () => {
    try {
      // Fetch all users with their roles
      const allUsersRes = await fetch("/api/users/all-with-roles");
      if (!allUsersRes.ok) throw new Error("Failed to fetch all users");
      const allUsersData = await allUsersRes.json();
      setAllUsers(allUsersData);

      // Filter out members and guests for the privileged users table
      const privilegedUsers = allUsersData.filter((user: User) => {
        if (!user.roles || user.roles.length === 0) {
          return false;
        }
        return !user.roles.every(role => role === "MEMBER" || role === "GUEST");
      });
      setUsers(privilegedUsers);

      // Fetch all available roles
      const rolesRes = await fetch("/api/roles"); // Assuming this endpoint will be created
      if (!rolesRes.ok) throw new Error("Failed to fetch roles");
      const rolesData = await rolesRes.json();
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message);
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
      const res = await fetch("/api/users/update-role", { // Assuming this endpoint will be created
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          roleName: selectedRole,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      setSelectedUser(null);
      setSelectedRole(null);
      fetchUsersAndRoles(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRevokeRole = async (userId: string, roleName: string) => {
    try {
      const res = await fetch("/api/users/revoke-role", { // Assuming this endpoint will be created
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          roleName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to revoke user role");
      }

      fetchUsersAndRoles(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Role Management</h1>
        <p className="text-lg text-gray-600">Loading users and roles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Role Management</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Role Management</h1>
      <p className="text-lg text-gray-600 mb-4">Manage user roles and permissions.</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assign/Change Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user-select" className="block text-gray-700 text-sm font-bold mb-2">
                Select User:
              </label>
              <Select
                onValueChange={(value) => setSelectedUser(allUsers.find(user => user.id === value) || null)}
                value={selectedUser?.id || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="role-select" className="block text-gray-700 text-sm font-bold mb-2">
                Select Role:
              </label>
              <Select
                onValueChange={(value) => setSelectedRole(value)}
                value={selectedRole || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleRoleChange} disabled={!selectedUser || !selectedRole}>
                Assign/Update Role
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users with Privileged Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.roles.join(", ")}</TableCell>
                      <TableCell>
                        {user.roles.map((role) => (
                          <Button
                            key={role}
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeRole(user.id, role)}
                            className="mr-2 mb-2"
                          >
                            Revoke {role}
                          </Button>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No privileged users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementPage;
