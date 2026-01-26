"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Bell,
  Mail,
  Users,
  Calendar,
  Cross,
  BookOpen,
  HeartHandshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrayerRequest {
  id: string;
  request: string;
  isUrgent: boolean;
  isPublic: boolean;
  userId: string | null;
  createdAt: string;
  status: "ONGOING" | "PENDING" | "PRAYED";
  user?: { name: string | null; email: string | null };
}

interface SpiritualGrowthMetricsData {
  weeklyAttendance: number;
  monthlyGrowth: number;
  newBelievers: number;
  smallGroups: number;
  bibleStudies: number;
}

const SeniorPastorDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalMinistries, setTotalMinistries] = useState<number | null>(null);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [spiritualGrowthMetrics, setSpiritualGrowthMetrics] =
    useState<SpiritualGrowthMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [prayerRequestLoading, setPrayerRequestLoading] = useState<
    string | null
  >(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetching for better performance
        const [
          usersRes,
          ministriesRes,
          eventsRes,
          prayerRequestsRes,
          metricsRes,
        ] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/ministries"),
          fetch("/api/events"),
          fetch("/api/prayer-requests"),
          fetch("/api/metrics/spiritual-growth"),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!ministriesRes.ok) throw new Error("Failed to fetch ministries");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        if (!prayerRequestsRes.ok)
          throw new Error("Failed to fetch prayer requests");
        if (!metricsRes.ok)
          throw new Error("Failed to fetch spiritual growth metrics");

        const [
          usersData,
          ministriesData,
          eventsData,
          prayerRequestsData,
          metricsData,
        ] = await Promise.all([
          usersRes.json(),
          ministriesRes.json(),
          eventsRes.json(),
          prayerRequestsRes.json(),
          metricsRes.json(),
        ]);

        setTotalUsers(usersData.length);
        setTotalMinistries(ministriesData.ministries.length);
        setTotalEvents(eventsData.length);
        setPrayerRequests(prayerRequestsData);
        setSpiritualGrowthMetrics(metricsData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
        toast.error("Failed to load dashboard data", {
          description: err.message,
        });
      } finally {
        setLoading(false);
        setMetricsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPrayerRequests = prayerRequests.filter((request) => {
    if (filterStatus === "all") return true;
    return request.status === filterStatus;
  });

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.warning("Please enter a message to broadcast");
      return;
    }
    setBroadcastLoading(true);
    try {
      const res = await fetch("/api/announcements/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to broadcast announcement"
        );
      }

      toast.success("Announcement broadcasted successfully!", {
        description: "Your message has been sent to all members.",
      });
      setBroadcastMessage("");
    } catch (err: any) {
      toast.error("Broadcast failed", {
        description: err.message,
      });
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleSendPastoralEmail = async () => {
    if (!emailData.recipient || !emailData.subject || !emailData.message) {
      toast.warning("Please fill all email fields");
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/email/send-pastoral-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      toast.success("Email sent successfully!", {
        description: `To: ${emailData.recipient}`,
      });
      setEmailData({ recipient: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error("Email failed to send", {
        description: err.message,
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleMarkAsPrayed = async (id: string) => {
    setPrayerRequestLoading(id);
    try {
      const res = await fetch(`/api/prayer-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PRAYED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update prayer request");
      }

      toast.success("Prayer request marked as prayed!");
      setPrayerRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "PRAYED" } : req))
      );
    } catch (err: any) {
      toast.error("Update failed", {
        description: err.message,
      });
    } finally {
      setPrayerRequestLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-96 bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg bg-gray-800" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg bg-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <Cross className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Dashboard Error
          </h1>
          <p className="text-red-300 mb-6">{error}</p>
          <Button
            variant="outline"
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry Loading Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Senior Pastor Dashboard
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Oversee spiritual growth and church leadership with comprehensive
          insights and tools.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-900/30 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-white">
                {totalUsers !== null ? totalUsers : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-900/30 p-3 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Ministries</p>
              <p className="text-2xl font-bold text-white">
                {totalMinistries !== null ? totalMinistries : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-900/30 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Upcoming Events</p>
              <p className="text-2xl font-bold text-white">
                {totalEvents !== null ? totalEvents : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Spiritual Growth Metrics */}
        <Card className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <HeartHandshake className="h-6 w-6 text-blue-400" />
              Spiritual Growth Metrics
            </CardTitle>
            <CardDescription className="text-gray-400">
              Key indicators of congregational health
            </CardDescription>
            {metricsError && (
              <div className="text-red-400 text-sm mt-2">{metricsError}</div>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">
                Church Growth
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Weekly Attendance:</span>
                  <span className="font-medium text-white">
                    {metricsLoading ? (
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    ) : (
                      spiritualGrowthMetrics?.weeklyAttendance ?? "N/A"
                    )}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Monthly Growth:</span>
                  <span
                    className={`font-medium ${
                      spiritualGrowthMetrics &&
                      spiritualGrowthMetrics.monthlyGrowth > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {metricsLoading ? (
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    ) : (
                      <>
                        {spiritualGrowthMetrics &&
                        spiritualGrowthMetrics.monthlyGrowth > 0
                          ? "+"
                          : ""}
                        {spiritualGrowthMetrics?.monthlyGrowth}%
                      </>
                    )}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">New Believers:</span>
                  <span className="font-medium text-white">
                    {metricsLoading ? (
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    ) : (
                      spiritualGrowthMetrics?.newBelievers ?? "N/A"
                    )}
                  </span>
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-200 mt-4">
                Discipleship
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Small Groups:</span>
                  <span className="font-medium text-white">
                    {metricsLoading ? (
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    ) : (
                      spiritualGrowthMetrics?.smallGroups ?? "N/A"
                    )}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Bible Studies:</span>
                  <span className="font-medium text-white">
                    {metricsLoading ? (
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    ) : (
                      spiritualGrowthMetrics?.bibleStudies ?? "N/A"
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">
                Engagement
              </h3>
              <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center border border-gray-600">
                <p className="text-gray-500 text-center">
                  Engagement visualization coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Tools */}
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Mail className="h-6 w-6 text-purple-400" />
              Communication Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-blue-700 hover:bg-blue-800 text-white">
                  <Bell className="h-4 w-4" />
                  Broadcast Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700/50 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Broadcast Announcement
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your announcement message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={5}
                    className="bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <Button
                    onClick={handleBroadcast}
                    disabled={broadcastLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {broadcastLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Send to Entire Congregation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
                >
                  <Mail className="h-4 w-4" />
                  Send Pastoral Email
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700/50 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Compose Pastoral Email
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Recipient email"
                    value={emailData.recipient}
                    onChange={(e) =>
                      setEmailData({ ...emailData, recipient: e.target.value })
                    }
                    className="bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <Input
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                    className="bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <Textarea
                    placeholder="Your message..."
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                    rows={5}
                    className="bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <Button
                    onClick={handleSendPastoralEmail}
                    disabled={emailLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {emailLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Send Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Leadership & Administration */}
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Users className="h-6 w-6 text-green-400" />
              Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2 bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() => (window.location.href = "/worship_leader")}
            >
              Worship Leader Portal
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
              onClick={() => (window.location.href = "/senior_pastor/users")}
            >
              Staff Management
            </Button>
          </CardContent>
        </Card>

        {/* Pastoral Care */}
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <HeartHandshake className="h-6 w-6 text-red-400" />
              Pastoral Care
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
              onClick={() =>
                (window.location.href = "/senior_pastor/prayer-requests")
              }
            >
              View Prayer Requests
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
              onClick={() =>
                (window.location.href = "/senior_pastor/pastoralcare/dashboard")
              }
            >
              Counseling Requests
            </Button>
          </CardContent>
        </Card>

        {/* Baptism/Ordinance */}
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <BookOpen className="h-6 w-6 text-orange-400" />
              Baptism & Ordinances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2 bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() =>
                (window.location.href = "/senior_pastor/baptism-candidates")
              }
            >
              Baptism Candidates
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
              onClick={() =>
                (window.location.href = "/senior_pastor/certificate-generator")
              }
            >
              Generate Certificates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Request Management */}
      <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <HeartHandshake className="h-6 w-6 text-blue-400" />
              Prayer Requests
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="PRAYED">Prayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPrayerRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-700/30">
                  <TableRow>
                    <TableHead className="text-gray-300 font-semibold">
                      Request
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Urgent
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Public
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Requested By
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-right text-gray-300 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-700">
                  {filteredPrayerRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() =>
                        (window.location.href = "/member/prayer-wall")
                      }
                    >
                      <TableCell className="font-medium max-w-[200px] truncate text-white">
                        {request.request}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            request.status === "PRAYED"
                              ? "bg-green-600 text-white"
                              : request.status === "ONGOING"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-600 text-white"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.isUrgent ? (
                          <Badge className="bg-red-600 text-white">
                            Urgent
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Normal</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.isPublic ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {request.user?.name || "Anonymous"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status !== "PRAYED" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPrayed(request.id)}
                            disabled={prayerRequestLoading === request.id}
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                          >
                            {prayerRequestLoading === request.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Mark as Prayed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <HeartHandshake className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">
                No prayer requests found
              </h3>
              <p className="text-gray-500 mt-2">
                {filterStatus === "all"
                  ? "There are currently no prayer requests."
                  : `No ${filterStatus.toLowerCase()} prayer requests.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeniorPastorDashboard;
