"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  roles: string[];
}

const AdminPastoralCarePage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    counselorId: "",
    clientId: "",
    date: "",
    status: "",
    notes: "",
    progress: 0,
  });

  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const statusColors: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/counseling-sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

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
    fetchSessions();
    fetchUsers();
    setLoading(false);
  }, []);

  const handleNewSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) : value,
    }));
  };

  const handleEditingSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "progress" ? parseInt(value) : value,
      };
    });
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/counseling-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSession,
          date: newSession.date ? new Date(newSession.date).toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add session");
      }

      setNewSession({
        counselorId: "",
        clientId: "",
        date: "",
        status: "",
        notes: "",
        progress: 0,
      });
      fetchSessions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingSession) return;

    try {
      const res = await fetch(`/api/counseling-sessions?id=${editingSession.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingSession,
          date: editingSession.date ? new Date(editingSession.date).toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update session");
      }

      setEditingSession(null);
      fetchSessions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDelete = (id: string) => {
    setSessionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    setError(null);
    try {
      const res = await fetch(`/api/counseling-sessions?id=${sessionToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete session");
      }

      fetchSessions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pastoral Care Management</h1>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pastoral Care Management</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pastoral Care Management</h1>
        <p className="text-lg text-gray-600">Manage counseling sessions, prayer requests, and support groups.</p>
      </div>

      {/* Add/Edit Session Card */}
      <Card className="mb-8 border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <CardTitle className="flex items-center text-white">
            {editingSession ? (
              <>
                <Edit className="h-5 w-5 mr-2" />
                <span>Edit Session</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                <span>Add New Session</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={editingSession ? handleUpdateSession : handleAddSession}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="counselorId" className="block text-sm font-medium text-gray-700">
                  Counselor *
                </label>
                <Select
                  onValueChange={(value) => {
                    if (editingSession) {
                      setEditingSession((prev) => (prev ? { ...prev, counselorId: value } : null));
                    } else {
                      setNewSession((prev) => ({ ...prev, counselorId: value }));
                    }
                  }}
                  value={editingSession ? editingSession.counselorId : newSession.counselorId}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select Counselor" />
                  </SelectTrigger>
                  <SelectContent className="shadow-lg rounded-md">
                    {users
                      .filter((user) => user.roles.includes("COUNSELOR"))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id} className="hover:bg-gray-50">
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Client *
                </label>
                <Select
                  onValueChange={(value) => {
                    if (editingSession) {
                      setEditingSession((prev) => (prev ? { ...prev, clientId: value } : null));
                    } else {
                      setNewSession((prev) => ({ ...prev, clientId: value }));
                    }
                  }}
                  value={editingSession ? editingSession.clientId : newSession.clientId}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent className="shadow-lg rounded-md">
                    {users
                      .filter((user) => !user.roles.includes("COUNSELOR"))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id} className="hover:bg-gray-50">
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={editingSession ? editingSession.date.split("T")[0] : newSession.date}
                  onChange={editingSession ? handleEditingSessionChange : handleNewSessionChange}
                  required
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <Select
                  onValueChange={(value) => {
                    if (editingSession) {
                      setEditingSession((prev) => (prev ? { ...prev, status: value } : null));
                    } else {
                      setNewSession((prev) => ({ ...prev, status: value }));
                    }
                  }}
                  value={editingSession ? editingSession.status : newSession.status}
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="shadow-lg rounded-md">
                    <SelectItem value="Scheduled" className="hover:bg-gray-50">
                      Scheduled
                    </SelectItem>
                    <SelectItem value="Completed" className="hover:bg-gray-50">
                      Completed
                    </SelectItem>
                    <SelectItem value="Cancelled" className="hover:bg-gray-50">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editingSession ? editingSession.notes || "" : newSession.notes}
                  onChange={editingSession ? handleEditingSessionChange : handleNewSessionChange}
                  rows={4}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                  Progress
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    id="progress"
                    name="progress"
                    value={editingSession ? editingSession.progress : newSession.progress}
                    onChange={editingSession ? handleEditingSessionChange : handleNewSessionChange}
                    min="0"
                    max="100"
                    className="w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  />
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${editingSession ? editingSession.progress : newSession.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {editingSession && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSession(null)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md shadow-sm"
              >
                {editingSession ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Session
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Session
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <CardTitle className="text-white">Existing Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-600 font-medium">Counselor</TableHead>
                    <TableHead className="text-gray-600 font-medium">Client</TableHead>
                    <TableHead className="text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead className="text-gray-600 font-medium">Progress</TableHead>
                    <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const counselor = users.find((user) => user.id === session.counselorId);
                    const client = users.find((user) => user.id === session.clientId);

                    return (
                      <TableRow key={session.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="text-gray-900">{counselor?.name || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-700">{client?.name || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-700">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusColors[session.status] || "bg-gray-100 text-gray-800"
                            } rounded-md shadow-sm`}
                          >
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${session.progress}%`,
                                  backgroundColor:
                                    session.progress < 50 ? "#ef4444" : session.progress < 80 ? "#f59e0b" : "#10b981",
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{session.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSession(session)}
                              className="text-gray-600 hover:text-gray-900 border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(session.id)}
                              className="text-white hover:bg-red-700 rounded-md shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No sessions found</h3>
              <p className="mt-1 text-gray-500">Get started by adding a new counseling session.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-lg shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this counseling session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-md shadow-sm"
            >
              Delete Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPastoralCarePage;
