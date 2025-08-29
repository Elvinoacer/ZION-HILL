"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { safeFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Mic,
  User,
  Filter,
  Search,
  RefreshCw,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrayerRequest {
  id: string;
  request: string;
  isUrgent: boolean;
  isPublic: boolean;
  userId?: string;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  status: "ONGOING" | "PENDING" | "PRAYED";
  dailyRoomUrl?: string;
  dailyRoomName?: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ONGOING: "bg-blue-100 text-blue-800 border-blue-200",
  PRAYED: "bg-green-100 text-green-800 border-green-200",
};

const AdminPrayerRequestsPage = () => {
  const { data: session, status } = useSession();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitiatingRoom, setIsInitiatingRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const fetchPrayerRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch<PrayerRequest[]>(
        "/api/prayer-wall?admin=true"
      );
      setPrayerRequests(data);
      setFilteredRequests(data);
    } catch (err: any) {
      console.error("Failed to fetch prayer requests:", err);
      setError(err.message);
      toast.error("Failed to load prayer requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      const userRoles = session?.user?.roles || [];
      const hasPrayerManagerRole = userRoles.some(
        (role: any) => role === "PRAYER_MANAGER"
      );

      setIsAuthorized(hasPrayerManagerRole);
      fetchPrayerRequests();
    } else if (status === "unauthenticated") {
      setError("You must be logged in to view this page.");
      setLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    let results = prayerRequests;

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((request) => request.status === statusFilter);
    }

    // Apply urgency filter
    if (urgencyFilter !== "all") {
      results = results.filter((request) =>
        urgencyFilter === "urgent" ? request.isUrgent : !request.isUrgent
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (request) =>
          request.request.toLowerCase().includes(query) ||
          request.user?.name?.toLowerCase().includes(query) ||
          request.user?.email?.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(results);
  }, [prayerRequests, statusFilter, urgencyFilter, searchQuery]);

  const handleStatusChange = async (
    id: string,
    newStatus: PrayerRequest["status"]
  ) => {
    try {
      const response = await fetch(`/api/prayer-wall?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || `HTTP error! status: ${response.status}`
        );
      }

      toast.success(
        `Prayer request status updated to ${newStatus.toLowerCase()}.`
      );
      fetchPrayerRequests();
    } catch (err: any) {
      console.error("Failed to update prayer request status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const handleInitiateAudioRoom = async (prayerRequestId: string) => {
    setIsInitiatingRoom(true);
    setError(null);
    try {
      const response = await fetch("/api/daily-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prayerRequestId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create prayer room");
      }

      const data = await response.json();
      window.open(data.url, "_blank");
      toast.success("Prayer room created successfully!");
      fetchPrayerRequests(); // Refresh to update room status
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to initiate prayer room: ${err.message}`);
    } finally {
      setIsInitiatingRoom(false);
    }
  };

  const stats = {
    total: prayerRequests.length,
    pending: prayerRequests.filter((r) => r.status === "PENDING").length,
    ongoing: prayerRequests.filter((r) => r.status === "ONGOING").length,
    prayed: prayerRequests.filter((r) => r.status === "PRAYED").length,
    urgent: prayerRequests.filter((r) => r.isUrgent).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">
            {!isAuthorized
              ? "You are not authorized to view this page."
              : error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Prayer Request Management
          </h1>
          <p className="text-lg text-gray-600">
            Oversee and respond to community prayer needs
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Volume2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.ongoing}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Prayed For</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.prayed}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center text-xl">
                  <Bell className="h-6 w-6 mr-2" />
                  Community Prayer Requests
                </CardTitle>
                <Button
                  variant="secondary"
                  onClick={fetchPrayerRequests}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests or people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="PRAYED">Prayed For</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={urgencyFilter}
                    onValueChange={setUrgencyFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Filter by urgency" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Urgency</SelectItem>
                      <SelectItem value="urgent">Urgent Only</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.005 }}
                        transition={{ duration: 0.2 }}
                        className="border border-gray-100 p-5 rounded-xl shadow-sm bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-shrink-0">
                            {request.user?.image ? (
                              <img
                                src={request.user.image}
                                alt={request.user.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 break-words">
                                  {request.request}
                                </h3>
                                {request.user && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Submitted by{" "}
                                    {request.user.name || request.user.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 sm:justify-end">
                                {request.isUrgent && (
                                  <Badge
                                    variant="destructive"
                                    className="whitespace-nowrap"
                                  >
                                    URGENT
                                  </Badge>
                                )}
                                {!request.isPublic && (
                                  <Badge
                                    variant="secondary"
                                    className="whitespace-nowrap"
                                  >
                                    PRIVATE
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              Status:
                            </span>
                            <Select
                              value={request.status}
                              onValueChange={(
                                newStatus: PrayerRequest["status"]
                              ) => handleStatusChange(request.id, newStatus)}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                    Pending
                                  </div>
                                </SelectItem>
                                <SelectItem value="ONGOING">
                                  <div className="flex items-center">
                                    <Loader2 className="h-4 w-4 mr-2 text-blue-500 animate-spin" />
                                    Ongoing
                                  </div>
                                </SelectItem>
                                <SelectItem value="PRAYED">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Prayed
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {request.status === "ONGOING" && (
                            <div className="flex items-center gap-2">
                              {request.dailyRoomUrl ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    window.open(request.dailyRoomUrl, "_blank")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Mic className="h-4 w-4 mr-2" />
                                  Join Prayer Room
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleInitiateAudioRoom(request.id)
                                  }
                                  disabled={isInitiatingRoom}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {isInitiatingRoom ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mic className="mr-2 h-4 w-4" />
                                  )}
                                  Initiate Prayer Room
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <Bell className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No prayer requests found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    urgencyFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are currently no prayer requests to manage."}
                  </p>
                  {(searchQuery ||
                    statusFilter !== "all" ||
                    urgencyFilter !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setUrgencyFilter("all");
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPrayerRequestsPage;
