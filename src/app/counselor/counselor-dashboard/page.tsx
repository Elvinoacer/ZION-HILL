"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PastoralCareMessaging from "@/components/PastoralCareMessaging";
import { RoleName } from "@/generated/prisma";
import {
  FiCalendar,
  FiUser,
  FiUsers,
  FiMessageSquare,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lastSessionDate?: string;
}

interface CounselingSession {
  id: string;
  clientId: string;
  client: Client;
  date: string;
  status: string;
  topic?: { name: string };
  notes?: string;
  duration?: number;
}

const CounselorDashboardPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<CounselingSession[]>(
    []
  );
  const [pastSessions, setPastSessions] = useState<CounselingSession[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const currentUserId = session?.user?.id || "";
  const currentUserRole = session?.user?.roles?.includes(RoleName.COUNSELOR)
    ? "COUNSELOR"
    : "ADMIN";

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchCounselorData = async () => {
        setLoading(true);
        try {
          // Fetch assigned clients
          const clientsResponse = await fetch(
            `/api/counselor/clients?counselorId=${session.user.id}`
          );
          if (!clientsResponse.ok) {
            throw new Error("Failed to fetch assigned clients.");
          }
          const clientsData = await clientsResponse.json();
          setAssignedClients(clientsData);

          // Fetch upcoming sessions
          const sessionsResponse = await fetch(
            `/api/counselor/sessions?counselorId=${session.user.id}`
          );
          if (!sessionsResponse.ok) {
            throw new Error("Failed to fetch sessions.");
          }
          const sessionsData = await sessionsResponse.json();

          // Separate upcoming and past sessions
          const now = new Date();
          const upcoming = sessionsData.filter(
            (session: CounselingSession) => new Date(session.date) >= now
          );
          const past = sessionsData.filter(
            (session: CounselingSession) => new Date(session.date) < now
          );

          setUpcomingSessions(upcoming);
          setPastSessions(past);

          // Fetch unread messages count
          const unreadCountResponse = await fetch(
            `/api/pastoral-care/messages/unread-count?userId=${session.user.id}`
          );
          if (unreadCountResponse.ok) {
            const unreadCountData = await unreadCountResponse.json();
            setUnreadCount(unreadCountData.count);
          }
        } catch (err: any) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCounselorData();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
  }, [session, status]);

  // Filter sessions based on search term and status
  const filteredUpcomingSessions = upcomingSessions.filter((session) => {
    const matchesSearch =
      session.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPastSessions = pastSessions.filter((session) => {
    const matchesSearch =
      session.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    "all",
    "scheduled",
    "completed",
    "cancelled",
    "rescheduled",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
            Loading counselor dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-950/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">
            Error: {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Counselor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your counseling sessions and client communications
            </p>
          </div>

          <Button
            onClick={() => router.push("/counselor/schedule")}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <FiPlus className="mr-2" />
            Schedule Session
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                <FiUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {assignedClients.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assigned Clients
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                <FiCalendar className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {upcomingSessions.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming Sessions
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                <FiClock className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {pastSessions.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Past Sessions
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-4">
                <FiMessageSquare className="text-amber-600 dark:text-amber-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {unreadCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unread Messages
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Clients Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden lg:col-span-1"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
              <FiUsers className="text-white text-xl mr-3" />
              <h2 className="text-lg font-semibold text-white">
                Assigned Clients
              </h2>
              <span className="ml-auto bg-white text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {assignedClients.length}
              </span>
            </div>
            <div className="p-4">
              {assignedClients.length > 0 ? (
                <div className="space-y-3">
                  {assignedClients.slice(0, 5).map((client) => (
                    <div
                      key={client.id}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {client.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {client.email}
                          </p>
                          {client.phone && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center mt-1">
                              <FiPhone className="mr-1" size={12} />
                              {client.phone}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => router.push(`/member/${client.id}`)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <FiEye size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FiUsers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No clients assigned yet.</p>
                </div>
              )}
              {assignedClients.length > 5 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    onClick={() => router.push("/counselor/clients")}
                    variant="outline"
                    className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    View All Clients
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sessions Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden lg:col-span-2"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center">
              <FiCalendar className="text-white text-xl mr-3" />
              <h2 className="text-lg font-semibold text-white">
                Counseling Sessions
              </h2>
            </div>

            {/* Session Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-3 font-medium text-sm flex items-center ${
                    activeTab === "upcoming"
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiClock className="mr-2" />
                  Upcoming ({upcomingSessions.length})
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-3 font-medium text-sm flex items-center ${
                    activeTab === "past"
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiCalendar className="mr-2" />
                  Past ({pastSessions.length})
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                {activeTab === "upcoming" ? (
                  <motion.div
                    key="upcoming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredUpcomingSessions.length > 0 ? (
                      <div className="space-y-3">
                        {filteredUpcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800 dark:text-white">
                                  {session.client.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                    {session.topic?.name || "General"}
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      session.status === "scheduled"
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                        : session.status === "completed"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                        : session.status === "cancelled"
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                    }`}
                                  >
                                    {session.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center">
                                  <FiCalendar className="mr-1" size={14} />
                                  {new Date(
                                    session.date
                                  ).toLocaleDateString()}{" "}
                                  at{" "}
                                  {new Date(session.date).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </p>
                                {session.duration && (
                                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 flex items-center">
                                    <FiClock className="mr-1" size={14} />
                                    {session.duration} minutes
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  onClick={() =>
                                    router.push(`/member/${session.client.id}`)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                >
                                  <FiEye size={16} />
                                </Button>
                                <Button
                                  onClick={() =>
                                    router.push(
                                      `/counselor/sessions/${session.id}`
                                    )
                                  }
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FiCalendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No upcoming sessions found.</p>
                        {(searchTerm || filterStatus !== "all") && (
                          <Button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            variant="outline"
                            className="mt-4 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="past"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredPastSessions.length > 0 ? (
                      <div className="space-y-3">
                        {filteredPastSessions.map((session) => (
                          <div
                            key={session.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800 dark:text-white">
                                  {session.client.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                    {session.topic?.name || "General"}
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      session.status === "completed"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                        : session.status === "cancelled"
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                    }`}
                                  >
                                    {session.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center">
                                  <FiCalendar className="mr-1" size={14} />
                                  {new Date(session.date).toLocaleDateString()}
                                </p>
                                {session.notes && (
                                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                                    {session.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  onClick={() =>
                                    router.push(`/member/${session.client.id}`)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                >
                                  <FiEye size={16} />
                                </Button>
                                <Button
                                  onClick={() =>
                                    router.push(
                                      `/counselor/sessions/${session.id}/notes`
                                    )
                                  }
                                  size="sm"
                                  className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                  Notes
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FiCalendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No past sessions found.</p>
                        {(searchTerm || filterStatus !== "all") && (
                          <Button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            variant="outline"
                            className="mt-4 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Messaging System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex items-center">
            <FiMessageSquare className="text-white text-xl mr-3" />
            <h2 className="text-lg font-semibold text-white">
              Pastoral Care Messaging
            </h2>
          </div>
          <div className="p-4">
            <PastoralCareMessaging
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CounselorDashboardPage;
