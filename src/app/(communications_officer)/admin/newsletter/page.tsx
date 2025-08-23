"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TiptapEditor from "@/components/TiptapEditor";
import {
  Mail,
  Send,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText,
  Users,
} from "lucide-react";

const AdminNewsletterPage = () => {
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/newsletter-templates");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to fetch templates", err);
        setError("Could not load newsletter templates.");
      }
    };

    const fetchSubscriberCount = async () => {
      try {
        const res = await fetch("/api/subscribers/count");
        if (res.ok) {
          const data = await res.json();
          setSubscriberCount(data.count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch subscriber count", err);
      }
    };

    fetchTemplates();
    fetchSubscriberCount();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const fetchTemplateContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/newsletter-templates?template=${selectedTemplate}`
          );
          if (!res.ok) throw new Error("Failed to fetch template content");
          const data = await res.json();
          setHtmlContent(data.content);
          // Optionally set a subject from the template if available
          if (data.subject) {
            setSubject(data.subject);
          }
        } catch (err) {
          console.error("Failed to fetch template content", err);
          setError(`Failed to load content for "${selectedTemplate}".`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTemplateContent();
    }
  }, [selectedTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!subject.trim() || !htmlContent.trim()) {
      setError("Subject and content are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, html: htmlContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send newsletter");
      }

      setMessage(
        "Newsletter sent successfully to " + subscriberCount + " subscribers!"
      );
      setSubject("");
      setHtmlContent("");
      setSelectedTemplate(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Implement draft saving functionality
    alert("Draft saving functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 dark:bg-sky-900/30 rounded-full mb-4">
            <Mail className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
            Newsletter Publisher
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Compose and broadcast newsletters to all subscribed members.
          </p>

          {/* Subscriber Count */}
          <div className="inline-flex items-center mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {subscriberCount} subscribers
            </span>
          </div>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-700 dark:to-blue-700 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                <FileText className="mr-2 h-6 w-6" />
                Compose Message
              </CardTitle>
              <div className="mt-2 sm:mt-0">
                <span className="text-sky-100 text-sm font-medium bg-sky-700/30 px-3 py-1 rounded-full">
                  {subscriberCount} recipients
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="template"
                    className="block text-gray-700 dark:text-gray-300 text-sm font-medium"
                  >
                    Use a Template
                  </label>
                  <Select
                    onValueChange={setSelectedTemplate}
                    value={selectedTemplate || ""}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template.charAt(0).toUpperCase() +
                            template.slice(1).replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select a template to prefill content
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 dark:text-gray-300 text-sm font-medium"
                  >
                    Subject Line
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    placeholder="Enter an engaging subject line"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subject.length}/60 characters
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="htmlContent"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  Newsletter Content
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
                  <TiptapEditor
                    content={htmlContent}
                    onChange={setHtmlContent}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Status Messages */}
              <div className="space-y-3">
                {message && (
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Success!</p>
                      <p className="text-sm">{message}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Save Draft
                </Button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      setSubject("");
                      setHtmlContent("");
                      setSelectedTemplate(null);
                      setError(null);
                    }}
                  >
                    Clear All
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md shadow-blue-500/20 flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to {subscriberCount} Subscribers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  Best Practices
                </h3>
                <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1">
                  <li>
                    • Keep subject lines under 60 characters for best display
                  </li>
                  <li>
                    • Test your newsletter on different devices before sending
                  </li>
                  <li>• Consider time zones when scheduling broadcasts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNewsletterPage;
