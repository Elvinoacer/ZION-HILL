"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OutreachProgram {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
}

const AdminOutreachPage = () => {
  const [outreachPrograms, setOutreachPrograms] = useState<OutreachProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  const [editingProgram, setEditingProgram] = useState<OutreachProgram | null>(null);

  const fetchOutreachPrograms = async () => {
    try {
      const res = await fetch('/api/outreach-programs');
      if (!res.ok) throw new Error('Failed to fetch outreach programs');
      const data = await res.json();
      setOutreachPrograms(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOutreachPrograms();
    setLoading(false);
  }, []);

  const handleNewProgramChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditingProgramChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingProgram((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/outreach-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProgram),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add outreach program');
      }

      setNewProgram({
        title: '',
        description: '',
        date: '',
        location: '',
      });
      fetchOutreachPrograms(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingProgram) return;

    try {
      const res = await fetch(`/api/outreach-programs?id=${editingProgram.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProgram),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update outreach program');
      }

      setEditingProgram(null);
      fetchOutreachPrograms(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/outreach-programs?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete outreach program');
      }

      fetchOutreachPrograms(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Outreach Programs Management</h1>
        <p className="text-lg text-gray-600">Loading outreach programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Outreach Programs Management</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Outreach Programs Management</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage community outreach initiatives and mission trips.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingProgram ? 'Edit Outreach Program' : 'Add New Outreach Program'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingProgram ? handleUpdateProgram : handleAddProgram} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
              <Input type="text" id="title" name="title" value={editingProgram ? editingProgram.title : newProgram.title} onChange={editingProgram ? handleEditingProgramChange : handleNewProgramChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <Textarea id="description" name="description" value={editingProgram ? editingProgram.description || '' : newProgram.description} onChange={editingProgram ? handleEditingProgramChange : handleNewProgramChange} />
            </div>
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <Input type="date" id="date" name="date" value={editingProgram ? editingProgram.date?.split('T')[0] || '' : newProgram.date} onChange={editingProgram ? handleEditingProgramChange : handleNewProgramChange} />
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
              <Input type="text" id="location" name="location" value={editingProgram ? editingProgram.location || '' : newProgram.location} onChange={editingProgram ? handleEditingProgramChange : handleNewProgramChange} />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingProgram ? 'Update Program' : 'Add Program'}
              </Button>
              {editingProgram && (
                <Button type="button" variant="outline" onClick={() => setEditingProgram(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Outreach Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {outreachPrograms.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outreachPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>{program.title}</TableCell>
                      <TableCell>{program.description || 'N/A'}</TableCell>
                      <TableCell>{program.date ? new Date(program.date).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{program.location || 'N/A'}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingProgram(program)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No outreach programs found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOutreachPage;
