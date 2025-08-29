"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BookOpen,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Upload,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
}

interface ResourceAsset {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

const SecretaryDashboard = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [documents, setDocuments] = useState<ResourceAsset[]>([]);
  const [templates, setTemplates] = useState<ResourceAsset[]>([]);
  const [testimony, setTestimony] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      const userRoles = session?.user?.roles || [];
      const hasSecretaryRole = userRoles.some(
        (role: any) => role === "SECRETARY"
      );
      setIsAuthorized(hasSecretaryRole);

      if (true) {
        const fetchData = async () => {
          try {
            // Fetch Events (for calendar oversight)
            const eventsRes = await fetch("/api/events");
            if (!eventsRes.ok) throw new Error("Failed to fetch events");
            const eventsData = await eventsRes.json();
            setEvents(eventsData);

            // Fetch Documents
            const documentsRes = await fetch("/api/resources?type=PDF");
            if (!documentsRes.ok) throw new Error("Failed to fetch documents");
            const documentsData = await documentsRes.json();
            setDocuments(documentsData);

            // Fetch Templates
            const templatesRes = await fetch("/api/resources?type=TEMPLATE");
            if (!templatesRes.ok) throw new Error("Failed to fetch templates");
            const templatesData = await templatesRes.json();
            setTemplates(templatesData);
          } catch (err: any) {
            setError(err.message);
            toast.error("Failed to load dashboard data.");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else {
        setError("You are not authorized to view this page.");
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      setError("You must be logged in to view this page.");
      setLoading(false);
    }
  }, [status, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Skeleton className="h-8 w-48 mr-2 sm:h-10 sm:w-64 sm:mr-4" />
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800"
              >
                <CardHeader className="bg-gray-700/30 pb-3">
                  <Skeleton className="h-5 w-32 sm:h-6 sm:w-40" />
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="max-w-sm w-full border-red-700/50 shadow-xl bg-gray-800 text-white">
          <CardHeader className="text-center bg-gray-700/30">
            <div className="mx-auto bg-red-900/30 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
            </div>
            <CardTitle className="text-red-400">Access Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => (window.location.href = "/")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimony || !image) {
      toast.error("Please provide both a testimony and an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image.");
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      const feedbackRes = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: testimony,
          imageUrl: imageUrl,
          sentiment: "POSITIVE",
          userId: session?.user?.id,
          tags: ["testimony"],
        }),
      });

      if (!feedbackRes.ok) {
        throw new Error("Failed to submit testimony.");
      }

      toast.success("Testimony submitted successfully!");
      setTestimony("");
      setImage(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 sm:h-9 sm:w-9 text-blue-400" />
            Secretary Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            Welcome back, {session?.user?.name}. Manage administrative tasks and
            support services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Centralized Communication Hub */}
          <Card className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-blue-900/30 pb-3">
              <CardTitle className="flex items-center text-blue-400">
                <Mail className="mr-2 h-5 w-5" />
                Communication Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-gray-200">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    Unified Inbox
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">
                    Smart message routing and auto-categorization of
                    emails/calls.
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/secretary/inbox");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2"
                  >
                    View Inbox
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-gray-200">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    Response System
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">
                    Manage pre-approved templates for common inquiries.
                  </p>
                  <Button
                    className="w-full text-sm sm:text-base py-2"
                    variant="outline"
                    onClick={() =>
                      toast.info(
                        "Template management features are under development."
                      )
                    }
                  >
                    Manage Templates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar & Scheduling */}
          <Card className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-amber-900/30 pb-3">
              <CardTitle className="flex items-center text-amber-400">
                <Calendar className="mr-2 h-5 w-5" />
                Calendar & Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-gray-200">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Upcoming Events
                  </h3>
                  {events.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="mb-2 p-2 bg-gray-800/50 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-xs sm:text-sm">{event.title}</strong>
                            <Badge
                              variant="outline"
                              className="ml-1 text-xs sm:text-sm whitespace-nowrap"
                            >
                              {new Date(event.date).toLocaleDateString()}
                            </Badge>
                          </div>
                          {event.location && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center">
                              <Building className="mr-1 h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">
                      No upcoming events found.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-gray-200">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    Facility Booking
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">
                    Track room utilization and equipment reservations.
                  </p>
                  <Button className="w-full text-sm sm:text-base py-2" variant="outline">
                    Manage Bookings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-emerald-900/30 pb-3">
              <CardTitle className="flex items-center text-emerald-400">
                <FileText className="mr-2 h-5 w-5" />
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-200">Digital Files</h3>
                  {documents.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {documents.slice(0, 3).map((doc) => (
                        <div
                          key={doc.id}
                          className="mb-2 p-2 bg-gray-800/50 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-xs sm:text-sm">{doc.title}</strong>
                            <Badge variant="secondary" className="text-xs">
                              {doc.tags[0]}
                            </Badge>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center mt-1"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Document
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">
                      No documents found.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-200">
                    Template Library
                  </h3>
                  {templates.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {templates.slice(0, 3).map((template) => (
                        <div
                          key={template.id}
                          className="mb-2 p-2 bg-gray-800/50 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-xs sm:text-sm">
                              {template.title}
                            </strong>
                            <Badge variant="secondary" className="text-xs">
                              {template.tags[0]}
                            </Badge>
                          </div>
                          <a
                            href={template.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center mt-1"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Template
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">
                      No templates found.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Services */}
          <Card className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-violet-900/30 pb-3">
              <CardTitle className="flex items-center text-violet-400">
                <Users className="mr-2 h-5 w-5" />
                Member Services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-200">
                    Database Maintenance
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">
                    Tools for bulk updates, directory refresh, and family
                    mapping.
                  </p>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm sm:text-base py-2">
                    Manage Members
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-200">
                    Visitor Follow-Up
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">
                    Automated "Thank You" emails and connection card processing.
                  </p>
                  <Button className="w-full text-sm sm:text-base py-2" variant="outline">
                    Process Visitors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Testimony */}
          <Card className="overflow-hidden border-gray-700/50 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="bg-rose-900/30 pb-3">
              <CardTitle className="flex items-center text-rose-400">
                <Upload className="mr-2 h-5 w-5" />
                Share Testimony
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTestimonySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-2 block text-gray-300">
                      Your Testimony
                    </label>
                    <Textarea
                      placeholder="Share your experience or testimony..."
                      value={testimony}
                      onChange={(e) => setTestimony(e.target.value)}
                      className="min-h-[100px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-2 block text-gray-300">
                      Upload Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 hover:border-rose-400 transition-colors bg-gray-800">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-gray-500" />
                          <p className="mb-1 text-xs sm:text-sm text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            setImage(e.target.files ? e.target.files[0] : null)
                          }
                        />
                      </label>
                    </div>
                    {image && (
                      <p className="text-sm text-green-400 mt-2 flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {image.name} selected
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm sm:text-base py-2"
                    disabled={!testimony || !image}
                  >
                    Submit Testimony
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
