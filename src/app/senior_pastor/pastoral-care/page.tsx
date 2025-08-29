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
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  Calendar,
  User,
  Users,
  BarChart3,
  Search,
  Filter,
  X,
  Inbox,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SessionStatusChart,
  MonthlyTrendsChart,
  TopTopicsChart,
} from "@/components/pastoral-care/ReportCharts";

interface Session {
  id: string;
  counselorId: string;
  clientId: string;
  date: string;
  status: string;
  notes?: string;
  progress: number;
  topic?: { name: string };
}

interface User {
  id: string;
  name: string;
  roles: string[];
}

interface CounselingRequest {
  id: string;
  date: string;
  status: string;
  notes: string;
  client: {
    id: string;
    name: string;
    email: string;
  } | null;
  topic: {
    id: string;
    name: string;
  };
}

const AdminPastoralCarePage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [counselingRequests, setCounselingRequests] = useState<
    CounselingRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newSession, setNewSession] = useState({
    counselorId: "",
    clientId: "",
    date: "",
    status: "",
    notes: "",
    progress: 0,
  });

  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
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

  const fetchCounselingRequests = async () => {
    try {
      const res = await fetch("/api/counseling-requests");
      if (!res.ok) throw new Error("Failed to fetch counseling requests");
      const data = await res.json();
      setCounselingRequests(data);
    } catch (err: any) {
      setError(err.message); // Reuse existing error state
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSessions(),
        fetchUsers(),
        fetchCounselingRequests(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleNewSessionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) || 0 : value,
    }));
  };

  const handleEditingSessionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "progress" ? parseInt(value) || 0 : value,
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
          date: newSession.date
            ? new Date(newSession.date).toISOString()
            : undefined,
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
      setIsFormExpanded(false);
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
      const res = await fetch(
        `/api/counseling-sessions?id=${editingSession.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editingSession,
            date: editingSession.date
              ? new Date(editingSession.date).toISOString()
              : undefined,
          }),
        }
      );

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
      const res = await fetch(
        `/api/counseling-sessions?id=${sessionToDelete}`,
        {
          method: "DELETE",
        }
      );

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

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRequestAction = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    setIsUpdating(id);
    setError(null);
    try {
      const res = await fetch(`/api/counseling-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to ${status.toLowerCase()} request`
        );
      }

      // Refresh the list of requests and sessions
      fetchCounselingRequests();
      fetchSessions(); // Also refresh the main sessions list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      searchTerm === "" ||
      users
        .find((u) => u.id === session.counselorId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      users
        .find((u) => u.id === session.clientId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const clientIds = [...new Set(sessions.map((session) => session.clientId))];
  const clientUsers = users.filter((user) => clientIds.includes(user.id));

  const clientsWithSessionCount = clientUsers.map((client) => {
    const clientSessions = sessions.filter(
      (session) => session.clientId === client.id
    );
    const sessionCount = clientSessions.length;
    const lastSession = clientSessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return {
      ...client,
      sessionCount,
      lastSessionDate: lastSession ? lastSession.date : null,
    };
  });

  // --- Reports Data Calculation ---
  const sessionStatusDistribution = sessions
    .reduce((acc, session) => {
      const status = session.status || "Unknown";
      const existing = acc.find((item) => item.name === status);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: status, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .filter((item) => item.value > 0);

  const monthlyTrends = sessions.reduce((acc, session) => {
    const month = new Date(session.date).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    let monthData = acc.find((d) => d.name === month);
    if (!monthData) {
      monthData = { name: month, new: 0, completed: 0 };
      acc.push(monthData);
    }
    // This is a simplification; you might need a separate `created_at` for a true "new" count
    monthData.new += 1;
    if (session.status === "Completed") {
      monthData.completed += 1;
    }

    return acc;
  }, [] as { name: string; new: number; completed: number }[]);

  monthlyTrends.sort((a, b) => {
    const dateA = new Date(`1 ${a.name}`);
    const dateB = new Date(`1 ${b.name}`);
    return dateA.getTime() - dateB.getTime();
  });

  const topCounselingTopics = sessions
    .reduce((acc, session) => {
      const topicName = session.topic?.name || "Uncategorized";
      const existing = acc.find((item) => item.name === topicName);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: topicName, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Get top 5

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter((s) => s.status === "Scheduled").length,
    completed: sessions.filter((s) => s.status === "Completed").length,
    inProgress: sessions.filter((s) => s.status === "In Progress").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-800">
              Pastoral Care Management
            </h1>
            <p className="mt-2 text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Pastoral Care Management
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading data
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Pastoral Care Management
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Manage counseling sessions, track progress, and support your
            community members.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.inProgress}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.scheduled}
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.completed}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="mb-8">
          <TabsList className="flex w-full max-w-full overflow-x-auto p-1 md:grid md:w-auto md:max-w-lg md:grid-cols-4 bg-gray-100 rounded-xl">
            <TabsTrigger
              value="sessions"
              className="data-[state=active]:bg-white rounded-lg py-2"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-white rounded-lg py-2 flex items-center"
            >
              Requests
              {counselingRequests.length > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white">
                  {counselingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:bg-white rounded-lg py-2"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-white rounded-lg py-2"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            {/* Add/Edit Session Card */}
            <Card className="mb-8 border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
              <CardHeader
                className="p-0 border-b border-gray-200 cursor-pointer"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
              >
                <div className="flex items-center justify-between p-6">
                  <CardTitle className="flex items-center text-gray-800">
                    {editingSession ? (
                      <>
                        <Edit className="h-5 w-5 mr-2 text-blue-600" />
                        <span>Edit Session</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2 text-blue-600" />
                        <span>Add New Session</span>
                      </>
                    )}
                  </CardTitle>
                  <div
                    className={`transform transition-transform ${
                      isFormExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isFormExpanded
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <CardContent className="p-6">
                  <form
                    onSubmit={
                      editingSession ? handleUpdateSession : handleAddSession
                    }
                  >
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
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
                        <label
                          htmlFor="counselorId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Counselor *
                        </label>
                        <Select
                          onValueChange={(value) => {
                            if (editingSession) {
                              setEditingSession((prev) =>
                                prev ? { ...prev, counselorId: value } : null
                              );
                            } else {
                              setNewSession((prev) => ({
                                ...prev,
                                counselorId: value,
                              }));
                            }
                          }}
                          value={
                            editingSession
                              ? editingSession.counselorId
                              : newSession.counselorId
                          }
                        >
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg h-11">
                            <SelectValue placeholder="Select Counselor" />
                          </SelectTrigger>
                          <SelectContent className="shadow-lg rounded-lg border border-gray-200">
                            {users
                              .filter((user) =>
                                user.roles.includes("COUNSELOR")
                              )
                              .map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                  className="hover:bg-gray-50 rounded-md px-3 py-2"
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="clientId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Client *
                        </label>
                        <Select
                          onValueChange={(value) => {
                            if (editingSession) {
                              setEditingSession((prev) =>
                                prev ? { ...prev, clientId: value } : null
                              );
                            } else {
                              setNewSession((prev) => ({
                                ...prev,
                                clientId: value,
                              }));
                            }
                          }}
                          value={
                            editingSession
                              ? editingSession.clientId
                              : newSession.clientId
                          }
                        >
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg h-11">
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent className="shadow-lg rounded-lg border border-gray-200">
                            {users
                              .filter(
                                (user) => !user.roles.includes("COUNSELOR")
                              )
                              .map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                  className="hover:bg-gray-50 rounded-md px-3 py-2"
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date *
                        </label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          value={
                            editingSession
                              ? editingSession.date.split("T")[0]
                              : newSession.date
                          }
                          onChange={
                            editingSession
                              ? handleEditingSessionChange
                              : handleNewSessionChange
                          }
                          required
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status *
                        </label>
                        <Select
                          onValueChange={(value) => {
                            if (editingSession) {
                              setEditingSession((prev) =>
                                prev ? { ...prev, status: value } : null
                              );
                            } else {
                              setNewSession((prev) => ({
                                ...prev,
                                status: value,
                              }));
                            }
                          }}
                          value={
                            editingSession
                              ? editingSession.status
                              : newSession.status
                          }
                        >
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg h-11">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="shadow-lg rounded-lg border border-gray-200">
                            <SelectItem
                              value="Scheduled"
                              className="hover:bg-gray-50 rounded-md px-3 py-2"
                            >
                              Scheduled
                            </SelectItem>
                            <SelectItem
                              value="In Progress"
                              className="hover:bg-gray-50 rounded-md px-3 py-2"
                            >
                              In Progress
                            </SelectItem>
                            <SelectItem
                              value="Completed"
                              className="hover:bg-gray-50 rounded-md px-3 py-2"
                            >
                              Completed
                            </SelectItem>
                            <SelectItem
                              value="Cancelled"
                              className="hover:bg-gray-50 rounded-md px-3 py-2"
                            >
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Notes
                        </label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={
                            editingSession
                              ? editingSession.notes || ""
                              : newSession.notes
                          }
                          onChange={
                            editingSession
                              ? handleEditingSessionChange
                              : handleNewSessionChange
                          }
                          rows={4}
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg"
                          placeholder="Add session notes here..."
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="progress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Progress:{" "}
                          {editingSession
                            ? editingSession.progress
                            : newSession.progress}
                          %
                        </label>
                        <div className="flex items-center gap-4">
                          <Input
                            type="range"
                            id="progress"
                            name="progress"
                            value={
                              editingSession
                                ? editingSession.progress
                                : newSession.progress
                            }
                            onChange={
                              editingSession
                                ? handleEditingSessionChange
                                : handleNewSessionChange
                            }
                            min="0"
                            max="100"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 w-12 text-center">
                            {editingSession
                              ? editingSession.progress
                              : newSession.progress}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      {editingSession && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingSession(null);
                            setIsFormExpanded(false);
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg shadow-sm transition-all duration-200"
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
              </div>
            </Card>

            {/* Sessions List */}
            <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-white p-6 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-gray-800 mb-4 md:mb-0">
                    Counseling Sessions
                  </CardTitle>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-gray-200">
                        <SelectItem value="all" className="rounded-md">
                          All Statuses
                        </SelectItem>
                        <SelectItem value="Scheduled" className="rounded-md">
                          Scheduled
                        </SelectItem>
                        <SelectItem value="In Progress" className="rounded-md">
                          In Progress
                        </SelectItem>
                        <SelectItem value="Completed" className="rounded-md">
                          Completed
                        </SelectItem>
                        <SelectItem value="Cancelled" className="rounded-md">
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {filteredSessions.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Counselor
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Client
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Date
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Status
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Progress
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-right py-3">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.map((session) => {
                          const counselor = users.find(
                            (user) => user.id === session.counselorId
                          );
                          const client = users.find(
                            (user) => user.id === session.clientId
                          );

                          return (
                            <TableRow
                              key={session.id}
                              className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <User className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="text-gray-900 font-medium">
                                    {counselor?.name || "N/A"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                    <User className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div className="text-gray-700">
                                    {client?.name || "N/A"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-gray-700">
                                  {new Date(session.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(session.date).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    statusColors[session.status] ||
                                    "bg-gray-100 text-gray-800 border-gray-200"
                                  } rounded-full px-3 py-1 text-xs font-medium`}
                                >
                                  {session.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${session.progress}%`,
                                        backgroundColor:
                                          session.progress < 30
                                            ? "#ef4444"
                                            : session.progress < 70
                                            ? "#f59e0b"
                                            : "#10b981",
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-8">
                                    {session.progress}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSession(session);
                                      setIsFormExpanded(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50 rounded-lg shadow-sm"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => confirmDelete(session.id)}
                                    className="text-white hover:bg-red-700 rounded-lg shadow-sm"
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
                  <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No sessions found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setIsFormExpanded(true);
                      }}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-white p-6 pb-0">
                <CardTitle className="text-gray-800">Clients</CardTitle>
                 <p className="text-sm text-gray-500 pt-1">A list of all members who have engaged in counseling sessions.</p>
              </CardHeader>
              <CardContent className="p-6">
                {clientsWithSessionCount.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Client Name
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Total Sessions
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Last Session
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Roles
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientsWithSessionCount.map((client) => (
                          <TableRow
                            key={client.id}
                            className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                  <User className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-gray-900 font-medium">
                                  {client.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-gray-700 text-center">
                              {client.sessionCount}
                            </TableCell>
                            <TableCell className="py-4 text-gray-700">
                              {client.lastSessionDate
                                ? new Date(
                                    client.lastSessionDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex gap-1">
                                {client.roles.map((role) => (
                                  <Badge key={role} variant="outline">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No clients found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      There are no clients with assigned sessions yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-white p-6 pb-0">
                <CardTitle className="text-gray-800">
                  New Counseling Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {counselingRequests.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Client
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Topic
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Date
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium py-3">
                            Notes
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium text-right py-3">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {counselingRequests.map((request) => (
                          <TableRow
                            key={request.id}
                            className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0"
                          >
                            <TableCell className="py-4">
                              <div className="font-medium text-gray-900">
                                {request.client?.name || "Anonymous"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.client?.email || "No email provided"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-gray-700">
                              {request.topic.name}
                            </TableCell>
                            <TableCell className="py-4 text-gray-700">
                              {new Date(request.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell className="py-4 text-gray-700 max-w-xs truncate">
                              {request.notes}
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRequestAction(request.id, "APPROVED")
                                  }
                                  disabled={isUpdating === request.id}
                                  className="text-green-600 hover:text-green-800 border-green-200 hover:bg-green-50 rounded-lg shadow-sm"
                                >
                                  {isUpdating === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Approve"
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleRequestAction(request.id, "REJECTED")
                                  }
                                  disabled={isUpdating === request.id}
                                  className="text-white hover:bg-red-700 rounded-lg shadow-sm"
                                >
                                  {isUpdating === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Reject"
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                     <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No new counseling requests
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Check back later for new requests.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle>Session Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionStatusChart data={sessionStatusDistribution} />
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle>Top Counseling Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopTopicsChart data={topCounselingTopics} />
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <p className="text-sm text-gray-500">
                    New vs. Completed Sessions Over Time
                  </p>
                </CardHeader>
                <CardContent>
                  <MonthlyTrendsChart data={monthlyTrends} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md rounded-xl shadow-xl border border-gray-200">
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-gray-800 text-center">
                Delete Session
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-center">
                Are you sure you want to delete this counseling session? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm mt-0 order-2 sm:order-1">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSession}
                className="bg-red-600 hover:bg-red-700 rounded-lg shadow-sm order-1 sm:order-2"
              >
                Delete Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminPastoralCarePage;
