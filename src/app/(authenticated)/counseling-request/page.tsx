"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons"; // Import Icons for loading spinner

interface CounselingTopic {
  id: string;
  name: string;
}

export default function CounselingRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: session?.user?.name || "",
    clientEmail: session?.user?.email || "",
    topicId: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<CounselingTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/counseling-topics");
        if (!res.ok) {
          throw new Error("Failed to fetch counseling topics");
        }
        const data = await res.json();
        setTopics(data);
      } catch (err: any) {
        setTopicsError(err.message);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        clientName: session.user.name || "",
        clientEmail: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (value: string) => {
    setFormData((prev) => ({ ...prev, topicId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/counseling-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clientId: session?.user?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to submit counseling request"
        );
      }

      toast.success(
        "Counseling request submitted successfully! We will contact you soon."
      );
      setFormData({
        clientName: session?.user?.name || "",
        clientEmail: session?.user?.email || "",
        topicId: "",
        notes: "",
      });
      router.back();
    } catch (error: any) {
      console.error("Error submitting counseling request:", error);
      toast.error(error.message || "Failed to submit counseling request.");
    } finally {
      setLoading(false);
    }
  };

  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Icons.spinner className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">
            Loading counseling topics...
          </p>
        </div>
      </div>
    );
  }

  if (topicsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Icons.warning className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-lg text-red-700">
            Error loading topics: {topicsError}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <CardHeader className="bg-blue-600 text-white p-6">
          <CardTitle className="text-3xl font-extrabold text-center">
            Request a Counseling Session
          </CardTitle>
          <p className="text-center text-blue-100 mt-2">
            Your well-being is important to us. Please fill out the form below.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="clientName"
                className="text-lg font-medium text-gray-700"
              >
                Your Name
              </Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName || session?.user?.name || ""}
                onChange={handleChange}
                required
                disabled={!!session?.user?.name}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="clientEmail"
                className="text-lg font-medium text-gray-700"
              >
                Your Email
              </Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail || session?.user?.email || ""}
                onChange={handleChange}
                required
                disabled={!!session?.user?.email}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="topicId"
                className="text-lg font-medium text-gray-700"
              >
                Topic of Concern
              </Label>
              <Select
                onValueChange={handleTopicChange}
                value={formData.topicId}
                required
              >
                <SelectTrigger className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {topics.map((topic) => (
                    <SelectItem
                      key={topic.id}
                      value={topic.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="notes"
                className="text-lg font-medium text-gray-700"
              >
                Brief Description of Your Need
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Please provide a brief description of what you'd like to discuss. All information is kept confidential."
                rows={6}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
