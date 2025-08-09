"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Session {
  id: string;
  counselorId: string;
  clientId: string;
  date: string;
  status: string;
  notes?: string;
  progress: number;
}

interface User {
  id: string;
  name: string;
  roles: { id: number; name: string }[];
}

const AdminPastoralCarePage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]); // For counselor and client selection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    counselorId: '',
    clientId: '',
    date: '',
    status: '',
    notes: '',
    progress: 0,
  });

  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
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
    fetchSessions();
    fetchUsers();
    setLoading(false);
  }, []);

  const handleNewSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value,
    }));
  };

  const handleEditingSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'progress' ? parseInt(value) : value,
      };
    });
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSession),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add session');
      }

      setNewSession({
        counselorId: '',
        clientId: '',
        date: '',
        status: '',
        notes: '',
        progress: 0,
      });
      fetchSessions(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingSession) return;

    try {
      const res = await fetch(`/api/sessions?id=${editingSession.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSession),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update session');
      }

      setEditingSession(null);
      fetchSessions(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSession = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/sessions?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete session');
      }

      fetchSessions(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Pastoral Care Management</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage counseling sessions, prayer requests, and support groups.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingSession ? 'Edit Session' : 'Add New Session'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingSession ? handleUpdateSession : handleAddSession} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="counselorId" className="block text-gray-700 text-sm font-bold mb-2">Counselor:</label>
              <Select onValueChange={(value) => {
                if (editingSession) {
                  setEditingSession(prev => prev ? { ...prev, counselorId: value } : null);
                } else {
                  setNewSession(prev => ({ ...prev, counselorId: value }));
                }
              }} value={editingSession ? editingSession.counselorId : newSession.counselorId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Counselor" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(user => user.roles.some(role => role.name === 'STAFF')).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="clientId" className="block text-gray-700 text-sm font-bold mb-2">Client:</label>
              <Select onValueChange={(value) => {
                if (editingSession) {
                  setEditingSession(prev => prev ? { ...prev, clientId: value } : null);
                } else {
                  setNewSession(prev => ({ ...prev, clientId: value }));
                }
              }} value={editingSession ? editingSession.clientId : newSession.clientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Client" />
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
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <Input type="date" id="date" name="date" value={editingSession ? editingSession.date.split('T')[0] : newSession.date} onChange={handleNewSessionChange} required />
            </div>
            <div>
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
              <Select onValueChange={(value) => {
                if (editingSession) {
                  setEditingSession(prev => prev ? { ...prev, status: value } : null);
                } else {
                  setNewSession(prev => ({ ...prev, status: value }));
                }
              }} value={editingSession ? editingSession.status : newSession.status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
              <Textarea id="notes" name="notes" value={editingSession ? editingSession.notes || '' : newSession.notes} onChange={handleNewSessionChange}></Textarea>
            </div>
            <div>
              <label htmlFor="progress" className="block text-gray-700 text-sm font-bold mb-2">Progress:</label>
              <Input type="number" id="progress" name="progress" value={editingSession ? editingSession.progress : newSession.progress} onChange={handleNewSessionChange} min="0" max="100" />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingSession ? 'Update Session' : 'Add Session'}
              </Button>
              {editingSession && (
                <Button type="button" variant="outline" onClick={() => setEditingSession(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Counselor</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{users.find(user => user.id === session.counselorId)?.name || 'N/A'}</TableCell>
                      <TableCell>{users.find(user => user.id === session.clientId)?.name || 'N/A'}</TableCell>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.status}</TableCell>
                      <TableCell>{session.progress}%</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingSession(session)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No pastoral care sessions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPastoralCarePage;
