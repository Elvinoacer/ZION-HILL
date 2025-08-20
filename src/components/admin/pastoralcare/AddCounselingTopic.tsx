"use client";

import { useState } from "react";
import { usePastoralCareStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Add New Counseling Topic
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="topicName" className="text-gray-700 font-medium">
            Topic Name
          </Label>
          <Input
            id="topicName"
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g., Anxiety, Marriage Counseling, Grief"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
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
