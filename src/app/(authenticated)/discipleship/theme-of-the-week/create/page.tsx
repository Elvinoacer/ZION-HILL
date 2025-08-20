"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateThemeOfTheWeekPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    verse: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await safeFetch("/api/theme-of-the-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success("Theme of the Week created successfully!");
      router.push("/discipleship"); // Redirect to discipleship dashboard or themes list
    } catch (err: any) {
      toast.error(`Failed to create theme: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.733 8.733 0 0 0 5.217 7.98c-.483.07-.95.148-1.404.246Zm-.002 3.118l-.354 1.185A.75.75 0 0 0 3 12.395m16.862-3.407c.483-.07.95-.148 1.404-.246a8.733 8.733 0 0 1 1.03 2.022m-.002 3.118l.354 1.185A.75.75 0 0 1 21 12.395m0 0c-.115.026-.229.053-.344.08H9.32c-.114-.027-.23-.054-.344-.08m5.018 0h-5.018m0 0a8.648 8.648 0 0 1-1.293-1.056m5.018 0a8.648 8.648 0 0 0 1.293-1.056m-7.497 6.383a.75.75 0 0 0 1.06-.057l1.972-2.185a.75.75 0 0 0 .174-.434v-4.395a.75.75 0 0 0-.32-.62L6.55 5.45m7.497 6.383a.75.75 0 0 1-1.06-.057l-1.972-2.185a.75.75 0 0 1-.174-.434v-4.395a.75.75 0 0 1 .32-.62L17.45 5.45m-4.997 6.383v4.395a.75.75 0 0 0 .32.62l2.65 1.766c.47.313.53.905.144 1.249-.176.153-.395.24-.624.24h-3.996a.75.75 0 0 1-.624-.24c-.386-.344-.326-.936.144-1.249l2.65-1.766a.75.75 0 0 0 .32-.62v-4.395Z" />
            </svg>
            <div>
              <CardTitle className="text-3xl font-extrabold">Create New Theme of the Week</CardTitle>
              <CardDescription className="text-blue-100 mt-1">Craft a powerful message to inspire your community.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <Label htmlFor="title" className="text-lg font-semibold text-gray-700 mb-2 block">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Theme of Hope"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="verse" className="text-lg font-semibold text-gray-700 mb-2 block">Verse</Label>
              <Textarea
                id="verse"
                name="verse"
                value={formData.verse}
                onChange={handleChange}
                required
                rows={4}
                placeholder="e.g., 'For God so loved the world...'"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="reference" className="text-lg font-semibold text-gray-700 mb-2 block">Reference</Label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
                placeholder="e.g., John 3:16"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="px-6 py-3 text-lg font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                Create Theme
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateThemeOfTheWeekPage;
