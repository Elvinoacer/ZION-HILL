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
import { Icons } from "@/components/icons";

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading counseling topics...
          </p>
        </div>
      </div>
    );
  }

  if (topicsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="text-center">
          <Icons.warning className="mx-auto h-12 w-12 text-red-600" />
          <p className="mt-4 text-lg font-medium text-red-700">
            Error loading topics: {topicsError}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-white shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <Card className="relative overflow-hidden rounded-2xl border-0 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="bg-white p-6 sm:p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Request a Counseling Session
            </CardTitle>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Your well-being is our priority. Fill out the form below to get
              started.
            </p>
          </CardHeader>
          <CardContent className="bg-white p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="clientName"
                  className="text-sm font-medium text-gray-700 sm:text-base"
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
                  className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="clientEmail"
                  className="text-sm font-medium text-gray-700 sm:text-base"
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
                  className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="topicId"
                  className="text-sm font-medium text-gray-700 sm:text-base"
                >
                  Topic of Concern
                </Label>
                <Select
                  onValueChange={handleTopicChange}
                  value={formData.topicId}
                  required
                >
                  <SelectTrigger className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-gray-200 bg-white shadow-lg">
                    {topics.map((topic) => (
                      <SelectItem
                        key={topic.id}
                        value={topic.id}
                        className="px-4 py-2 text-sm hover:bg-blue-50 sm:text-base"
                      >
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-700 sm:text-base"
                >
                  Brief Description of Your Need
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Please provide a brief, confidential description of what you'd like to discuss."
                  rows={5}
                  required
                  className="w-full resize-y rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Confidential Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
