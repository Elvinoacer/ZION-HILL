"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      const userRoles = session?.user?.roles || [];
      const hasSecretaryRole = userRoles.some(
        (role: any) => role === "SECRETARY"
      );
      setIsAuthorized(hasSecretaryRole);

      if (!hasSecretaryRole) {
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
            const templatesRes = await fetch("/api/resources?type=PDF");
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
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Secretary Dashboard
        </h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Secretary Dashboard
        </h1>
        <p className="text-lg text-red-500">Error: {error}</p>
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
          sentiment: "POSITIVE", // Assuming testimony is positive
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
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Secretary Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage administrative tasks and support services.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Centralized Communication Hub */}
        <Card>
          <CardHeader>
            <CardTitle>Centralized Communication Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              Unified Inbox Management
            </h3>
            <p className="text-gray-600 mb-4">
              Smart message routing and auto-categorization of emails/calls.
            </p>
            <Button className="w-full">View Inbox (Placeholder)</Button>

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Automated Response System
            </h3>
            <p className="text-gray-600 mb-4">
              Manage pre-approved templates for common inquiries and office
              hours alerts.
            </p>
            <Button className="w-full" onClick={() => toast.info("Template management features are under development.")}>Manage Templates</Button>
          </CardContent>
        </Card>

        {/* Calendar & Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar & Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              Upcoming Events (Master Calendar Oversight)
            </h3>
            {events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event.id} className="mb-2">
                    <strong>{event.title}</strong> -{" "}
                    {new Date(event.date).toLocaleDateString()}
                    {event.location && ` (${event.location})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming events found.</p>
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Facility Booking System
            </h3>
            <p className="text-gray-600 mb-4">
              Track room utilization and equipment reservations.
            </p>
            <Button className="w-full">Manage Bookings (Placeholder)</Button>
          </CardContent>
        </Card>

        {/* Document Management */}
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              Digital Filing System
            </h3>
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id} className="mb-2">
                    <strong>{doc.title}</strong>
                    <p className="text-gray-600 text-sm">
                      Tags: {doc.tags.join(", ")}
                    </p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents found.</p>
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Template Library
            </h3>
            {templates.length > 0 ? (
              <ul>
                {templates.map((template) => (
                  <li key={template.id} className="mb-2">
                    <strong>{template.title}</strong>
                    <p className="text-gray-600 text-sm">
                      Tags: {template.tags.join(", ")}
                    </p>
                    <a
                      href={template.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Template
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No templates found.</p>
            )}
          </CardContent>
        </Card>

        {/* Member Services */}
        <Card>
          <CardHeader>
            <CardTitle>Member Services</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Database Maintenance</h3>
            <p className="text-gray-600 mb-4">
              Tools for bulk updates, directory refresh, and family mapping.
            </p>
            <Button className="w-full">Manage Members (Placeholder)</Button>

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Visitor Follow-Up
            </h3>
            <p className="text-gray-600 mb-4">
              Automated "Thank You" emails and connection card processing.
            </p>
            <Button className="w-full">Process Visitors (Placeholder)</Button>
          </CardContent>
        </Card>

        {/* Add Testimony */}
        <Card>
          <CardHeader>
            <CardTitle>Add Testimony</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestimonySubmit}>
              <Textarea
                placeholder="Write a testimony..."
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                className="mb-4"
              />
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                className="mb-4"
              />
              <Button type="submit" className="w-full">Submit Testimony</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
