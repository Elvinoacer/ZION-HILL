"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Ministry {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leader?: { id: string; name: string }; // Include leader details
}

interface User {
  id: string;
  name: string;
}

const AdminMinistriesPage = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [users, setUsers] = useState<User[]>([]); // To select ministry leaders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMinistry, setNewMinistry] = useState({
    name: '',
    description: '',
    leaderId: '',
  });

  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  const fetchMinistries = async () => {
    try {
      const res = await fetch('/api/ministry');
      if (!res.ok) throw new Error('Failed to fetch ministries');
      const data = await res.json();
      setMinistries(data.ministries);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMinistries();
    fetchUsers();
    setLoading(false);
  }, []);

  const handleNewMinistryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMinistry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingMinistryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingMinistry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleAddMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/ministry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMinistry),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add ministry');
      }

      setNewMinistry({
        name: '',
        description: '',
        leaderId: '',
      });
      fetchMinistries(); // Refresh ministry list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateMinistry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingMinistry) return;

    try {
      const res = await fetch(`/api/ministry?id=${editingMinistry.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMinistry),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update ministry');
      }

      setEditingMinistry(null);
      fetchMinistries(); // Refresh ministry list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteMinistry = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/ministry?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete ministry');
      }

      fetchMinistries(); // Refresh ministry list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Ministry Management</h1>
        <p className="text-lg text-gray-600">Loading ministries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Ministry Management</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Ministry Management</h1>
      <p className="text-lg text-gray-600 mb-4">
        Oversee and manage all church ministries.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingMinistry ? handleUpdateMinistry : handleAddMinistry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <Input type="text" id="name" name="name" value={editingMinistry ? editingMinistry.name : newMinistry.name} onChange={editingMinistry ? handleEditingMinistryChange : handleNewMinistryChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <Textarea id="description" name="description" value={editingMinistry ? editingMinistry.description || '' : newMinistry.description} onChange={editingMinistry ? handleEditingMinistryChange : handleNewMinistryChange} />
            </div>
            <div>
              <label htmlFor="leaderId" className="block text-gray-700 text-sm font-bold mb-2">Leader:</label>
              <Select onValueChange={(value) => {
                if (editingMinistry) {
                  setEditingMinistry(prev => prev ? { ...prev, leaderId: value } : null);
                } else {
                  setNewMinistry(prev => ({ ...prev, leaderId: value }));
                }
              }} value={editingMinistry ? editingMinistry.leaderId : newMinistry.leaderId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingMinistry ? 'Update Ministry' : 'Add Ministry'}
              </Button>
              {editingMinistry && (
                <Button type="button" variant="outline" onClick={() => setEditingMinistry(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Ministries</CardTitle>
        </CardHeader>
        <CardContent>
          {ministries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ministries.map((ministry) => (
                    <TableRow key={ministry.id}>
                      <TableCell>{ministry.name}</TableCell>
                      <TableCell>{ministry.description}</TableCell>
                      <TableCell>{ministry.leader?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingMinistry(ministry)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteMinistry(ministry.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No ministries found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMinistriesPage;
