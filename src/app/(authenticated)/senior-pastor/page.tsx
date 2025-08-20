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

const SeniorPastorDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalMinistries, setTotalMinistries] = useState<number | null>(null);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayerRequestLoading, setPrayerRequestLoading] = useState<
    string | null
  >(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetching for better performance
        const [usersRes, ministriesRes, eventsRes, prayerRequestsRes] =
          await Promise.all([
            fetch("/api/users"),
            fetch("/api/ministry"),
            fetch("/api/events"),
            fetch("/api/prayer-requests"),
          ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!ministriesRes.ok) throw new Error("Failed to fetch ministries");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        if (!prayerRequestsRes.ok)
          throw new Error("Failed to fetch prayer requests");

        const [usersData, ministriesData, eventsData, prayerRequestsData] =
          await Promise.all([
            usersRes.json(),
            ministriesRes.json(),
            eventsRes.json(),
            prayerRequestsRes.json(),
          ]);

        setTotalUsers(usersData.length);
        setTotalMinistries(ministriesData.ministries.length);
        setTotalEvents(eventsData.length);
        setPrayerRequests(prayerRequestsData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
        toast.error("Failed to load dashboard data", {
          description: err.message,
        });
      } finally {
        setLoading(false);
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
    }
  };

  const handleSendPastoralEmail = async () => {
    if (!emailData.recipient || !emailData.subject || !emailData.message) {
      toast.warning("Please fill all email fields");
      return;
    }

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
    }
  };

  const handleActivatePrayerChain = async () => {
    try {
      const res = await fetch("/api/prayer-chain/activate", {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to activate prayer chain");
      }

      toast.success("Prayer chain activated!", {
        description: "The congregation has been notified to pray.",
      });
    } catch (err: any) {
      toast.error("Prayer chain activation failed", {
        description: err.message,
      });
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
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
          <Cross className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Dashboard Error
          </h1>
          <p className="text-red-500 mb-6">{error}</p>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Retry Loading Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Senior Pastor Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Oversee spiritual growth and church leadership with comprehensive
          insights and tools.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-bold">
                {totalUsers !== null ? totalUsers : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Ministries</p>
              <p className="text-2xl font-bold">
                {totalMinistries !== null ? totalMinistries : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold">
                {totalEvents !== null ? totalEvents : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Spiritual Growth Metrics */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-blue-600" />
              Spiritual Growth Metrics
            </CardTitle>
            <CardDescription>
              Key indicators of congregational health
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Church Growth
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Weekly Attendance:</span>
                  <span className="font-medium">1,250</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Monthly Growth:</span>
                  <span className="font-medium text-green-600">+3.2%</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">New Believers:</span>
                  <span className="font-medium">24</span>
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                Discipleship
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Small Groups:</span>
                  <span className="font-medium">42</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Bible Studies:</span>
                  <span className="font-medium">18</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Engagement
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  Engagement visualization coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Tools */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Mail className="h-6 w-6 text-purple-600" />
              Communication Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Bell className="h-4 w-4" />
                  Broadcast Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Broadcast Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your announcement message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={5}
                  />
                  <Button onClick={handleBroadcast} className="w-full">
                    Send to Entire Congregation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send Pastoral Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compose Pastoral Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Recipient email"
                    value={emailData.recipient}
                    onChange={(e) =>
                      setEmailData({ ...emailData, recipient: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Your message..."
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                    rows={5}
                  />
                  <Button onClick={handleSendPastoralEmail} className="w-full">
                    Send Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() =>
                (window.location.href = "/admin/preaching-calendar")
              }
            >
              <Calendar className="h-4 w-4" />
              Preaching Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Leadership & Administration */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2"
              onClick={() =>
                (window.location.href = "/worship-leader/dashboard")
              }
            >
              Worship Leader Portal
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/admin/budgets")}
            >
              Ministry Budgets
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/admin/staff")}
            >
              Staff Management
            </Button>
          </CardContent>
        </Card>

        {/* Pastoral Care */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-red-600" />
              Pastoral Care
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2"
              onClick={handleActivatePrayerChain}
            >
              Activate Prayer Chain
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/prayer-requests")}
            >
              View Prayer Requests
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/admin/counseling")}
            >
              Counseling Requests
            </Button>
          </CardContent>
        </Card>

        {/* Baptism/Ordinance */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-orange-600" />
              Baptism & Ordinances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2"
              onClick={() =>
                (window.location.href = "/admin/baptism-candidates")
              }
            >
              Baptism Candidates
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/admin/certificates")}
            >
              Generate Certificates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Request Management */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-blue-600" />
              Prayer Requests
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgent</TableHead>
                    <TableHead>Public</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrayerRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium max-w-xs truncate">
                        {request.request}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "PRAYED"
                              ? "default"
                              : request.status === "ONGOING"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.isUrgent ? (
                          <Badge variant="destructive">Urgent</Badge>
                        ) : (
                          <span className="text-gray-400">Normal</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.isPublic ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>{request.user?.name || "Anonymous"}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status !== "PRAYED" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPrayed(request.id)}
                            disabled={prayerRequestLoading === request.id}
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
              <HeartHandshake className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">
                No prayer requests found
              </h3>
              <p className="text-gray-400 mt-2">
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
