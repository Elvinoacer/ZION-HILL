"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  FileText,
  Mail,
  Users,
  BookOpen,
  Upload,
  Building,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Skeleton className="h-10 w-64 mr-4" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-border/40 shadow-sm"
              >
                <CardHeader className="bg-muted/30 pb-3">
                  <Skeleton className="h-6 w-40" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Access Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => (window.location.href = "/")}>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <MessageSquare className="mr-3 h-9 w-9 text-blue-600" />
            Secretary Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {session?.user?.name}. Manage administrative tasks and
            support services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Centralized Communication Hub */}
          <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-blue-50 pb-3">
              <CardTitle className="flex items-center text-blue-700">
                <Mail className="mr-2 h-5 w-5" />
                Communication Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    Unified Inbox
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Smart message routing and auto-categorization of
                    emails/calls.
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/secretary/inbox");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    View Inbox
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    Response System
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage pre-approved templates for common inquiries.
                  </p>
                  <Button
                    className="w-full"
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
          <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-amber-50 pb-3">
              <CardTitle className="flex items-center text-amber-700">
                <Calendar className="mr-2 h-5 w-5" />
                Calendar & Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Upcoming Events
                  </h3>
                  {events.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="mb-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-sm">{event.title}</strong>
                            <Badge
                              variant="outline"
                              className="ml-2 whitespace-nowrap"
                            >
                              {new Date(event.date).toLocaleDateString()}
                            </Badge>
                          </div>
                          {event.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Building className="mr-1 h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No upcoming events found.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    Facility Booking
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track room utilization and equipment reservations.
                  </p>
                  <Button className="w-full" variant="outline">
                    Manage Bookings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-emerald-50 pb-3">
              <CardTitle className="flex items-center text-emerald-700">
                <FileText className="mr-2 h-5 w-5" />
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Digital Files</h3>
                  {documents.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {documents.slice(0, 3).map((doc) => (
                        <div
                          key={doc.id}
                          className="mb-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-sm">{doc.title}</strong>
                            <Badge variant="secondary" className="text-xs">
                              {doc.tags[0]}
                            </Badge>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Document
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No documents found.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-lg font-semibold mb-2">
                    Template Library
                  </h3>
                  {templates.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {templates.slice(0, 3).map((template) => (
                        <div
                          key={template.id}
                          className="mb-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <strong className="text-sm">
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
                            className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Template
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No templates found.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Services */}
          <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-violet-50 pb-3">
              <CardTitle className="flex items-center text-violet-700">
                <Users className="mr-2 h-5 w-5" />
                Member Services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Database Maintenance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tools for bulk updates, directory refresh, and family
                    mapping.
                  </p>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700">
                    Manage Members
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-lg font-semibold mb-2">
                    Visitor Follow-Up
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automated "Thank You" emails and connection card processing.
                  </p>
                  <Button className="w-full" variant="outline">
                    Process Visitors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Testimony */}
          <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="bg-rose-50 pb-3">
              <CardTitle className="flex items-center text-rose-700">
                <Upload className="mr-2 h-5 w-5" />
                Share Testimony
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTestimonySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your Testimony
                    </label>
                    <Textarea
                      placeholder="Share your experience or testimony..."
                      value={testimony}
                      onChange={(e) => setTestimony(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Upload Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-rose-300 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
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
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {image.name} selected
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700"
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
