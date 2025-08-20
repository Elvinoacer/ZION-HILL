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
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PastoralCareMessaging from "@/components/PastoralCareMessaging"; // New import
import { RoleName } from "@/generated/prisma"; // New import

interface Client {
  id: string;
  name: string;
  email: string;
}

interface CounselingSession {
  id: string;
  clientId: string;
  client: Client;
  date: string;
  status: string;
  topic?: { name: string };
  notes?: string;
}

const CounselorDashboardPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<CounselingSession[]>(
    []
  );
  const router = useRouter();

  const currentUserId = session?.user?.id || "";
  const currentUserRole = session?.user?.roles?.includes(RoleName.COUNSELOR) ? "COUNSELOR" : "ADMIN"; // Assuming counselor for this dashboard

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchCounselorData = async () => {
        setLoading(true);
        try {
          // Fetch assigned clients (assuming an API endpoint for this)
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
            throw new Error("Failed to fetch upcoming sessions.");
          }
          const sessionsData = await sessionsResponse.json();
          setUpcomingSessions(sessionsData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Icons.spinner className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="text-lg font-medium text-blue-600">
            Loading counselor dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Icons.warning className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600">
            Error: {error}. Please try again.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 tracking-tight text-center lg:text-left"
        >
          Counselor Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <Card className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  Assigned Clients:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {assignedClients.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  Upcoming Sessions:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {upcomingSessions.length}
                </span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View All Sessions
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Sessions Card */}
          <Card className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {session.client.name}
                        </TableCell>
                        <TableCell>
                          {session.topic?.name || "General"}
                        </TableCell>
                        <TableCell>
                          {new Date(session.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{session.status}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              router.push(`/member/${session.client.id}`);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Icons.calendarOff className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-xl">No upcoming sessions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assigned Clients Card */}
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-100 p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Assigned Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {assignedClients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>N/A</TableCell>
                      {/* Placeholder for last session date */}
                      <TableCell>
                        <Button
                          onClick={() => {
                            router.push(`/member/${client.id}`);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Icons.usersOff className="h-12 w-12 mx-auto mb-4" />
                <p className="text-xl">No clients assigned yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messaging System */}
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-100 p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Messaging System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <PastoralCareMessaging currentUserId={currentUserId} currentUserRole={currentUserRole} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorDashboardPage;