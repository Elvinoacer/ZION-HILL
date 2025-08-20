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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Added toast import

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

  console.log(users);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "", // Added password field
    phone: "",
    address: "",
    membersince: "",
    birthdate: "",
    photo: "",
    roleIds: [] as number[],
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);

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
  console.log(roles);
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
    fetchUsers();
    fetchRoles();
    setLoading(false);
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
      const roleName = roles.find((role) => String(role.id) === value)?.name; // Get the role name from the ID
      if (!roleName) return prev; // Should not happen if value is valid role ID

      const updatedRoles = prev.roles.some((role) => role.name === roleName)
        ? prev.roles.filter((role) => role.name !== roleName)
        : [...prev.roles, { id: parseInt(value), name: roleName }]; // Store Role object with name

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
          password: newUser.password, // Include password
          phone: newUser.phone,
          address: newUser.address,
          membersince: newUser.membersince,
          birthdate: newUser.birthdate,
          photo: newUser.photo,
          roles: newUser.roleIds
            .map((id) => roles.find((r) => r.id === id)?.name)
            .filter(Boolean), // Convert roleIds to role names
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
      fetchUsers(); // Refresh user list
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
            .filter((name) => name !== ""), // Filter out empty strings
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setEditingUser(null);
      fetchUsers(); // Refresh user list
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

      fetchUsers(); // Refresh user list
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          User Management
        </h1>
        <p className="text-lg text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          User Management
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">User Management</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage church users, their profiles, and roles.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingUser ? "Edit User" : "Add New User"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={editingUser ? handleUpdateUser : handleAddUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name:
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email:
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password:
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={newUser.password} // Only for new user, not editing
                onChange={handleNewUserChange}
                required={!editingUser} // Required only for new user
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone:
              </label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={editingUser ? editingUser.phone || "" : newUser.phone}
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address:
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={
                  editingUser ? editingUser.address || "" : newUser.address
                }
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="membersince"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Member Since:
              </label>
              <Input
                type="date"
                id="membersince"
                name="membersince"
                value={
                  editingUser
                    ? editingUser.membersince || ""
                    : newUser.membersince
                }
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="birthdate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Birthdate:
              </label>
              <Input
                type="date"
                id="birthdate"
                name="birthdate"
                value={
                  editingUser ? editingUser.birthdate || "" : newUser.birthdate
                }
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="photo"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Photo URL:
              </label>
              <Input
                type="text"
                id="photo"
                name="photo"
                value={editingUser ? editingUser.photo || "" : newUser.photo}
                onChange={
                  editingUser ? handleEditingUserChange : handleNewUserChange
                }
              />
            </div>
            <div>
              <label
                htmlFor="roles"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Roles:
              </label>
              <Select
                onValueChange={
                  editingUser
                    ? handleEditingUserRoleChange
                    : handleNewUserRoleChange
                }
                value={
                  editingUser
                    ? String(editingUser.roles[0]?.id || "") // Select only the first role's ID, or empty string
                    : String(newUser.roleIds[0] || "") // Select only the first roleId, or empty string
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select roles" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingUser ? "Update User" : "Add User"}
              </Button>
              {editingUser && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
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
                      <TableCell>
                        {user.roles.map((role) => role.name).join(", ")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingUser({
                              ...user,
                              phone: user.phone || "",
                              address: user.address || "",
                              membersince: user.membersince || "",
                              birthdate: user.birthdate || "",
                              photo: user.photo || "",
                              roles: user.roles || [], // Ensure roles is an array
                            })
                          }
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
