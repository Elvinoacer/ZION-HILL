"use client";

import { useState } from "react";
import { usePastoralCareStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Import Loader2

export default function AddCounselingTopic() {
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchCounselingTopics } = usePastoralCareStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      toast.error("Topic name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/counseling-topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: topicName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add counseling topic.");
      }

      toast.success("Counseling topic added successfully!");
      setTopicName("");
      await fetchCounselingTopics(true); // Force re-fetch after adding
    } catch (error: any) {
      console.error("Error adding counseling topic:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 h-full">
      <h2 className="text-2xl font-bold mb-4 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Add New Counseling Topic
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="topicName" className="text-gray-300 font-medium">
            Topic Name
          </Label>
          <Input
            id="topicName"
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g., Anxiety, Marriage Counseling, Grief"
            className="mt-1 block w-full rounded-lg border-gray-700 shadow-sm focus:border-blue-400 focus:ring-blue-400 text-sm transition-colors bg-gray-900 text-gray-200"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-800 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              Adding...
            </span>
          ) : (
            "Add Topic"
          )}
        </Button>
      </form>
    </div>
  );
}
