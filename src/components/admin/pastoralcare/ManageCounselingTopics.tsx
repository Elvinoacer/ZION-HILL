"use client";

import { useEffect, useState } from "react";
import { usePastoralCareStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CounselingTopic {
  id: string;
  name: string;
}

export default function ManageCounselingTopics() {
  const { counselingTopics, fetchCounselingTopics, loading, error } =
    usePastoralCareStore();

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState("");

  useEffect(() => {
    fetchCounselingTopics();
  }, [fetchCounselingTopics]);

  const handleEdit = (topic: CounselingTopic) => {
    setEditingTopicId(topic.id);
    setEditingTopicName(topic.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingTopicName.trim()) {
      toast.error("Topic name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/counseling-topics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: editingTopicName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update counseling topic."
        );
      }

      toast.success("Counseling topic updated successfully!");
      setEditingTopicId(null);
      setEditingTopicName("");
      await fetchCounselingTopics(true); // Force re-fetch after update
    } catch (error: any) {
      console.error("Error updating counseling topic:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/counseling-topics?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete counseling topic."
        );
      }

      toast.success("Counseling topic deleted successfully!");
      await fetchCounselingTopics(true); // Force re-fetch after delete
    } catch (error: any) {
      console.error("Error deleting counseling topic:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-4">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
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
        <p className="ml-2 text-gray-600">Loading topics...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-4 text-red-500">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <p className="ml-2 text-red-600">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Manage Counseling Topics
      </h2>
      {counselingTopics.length === 0 ? (
        <p className="text-gray-600 py-4 text-center">
          No counseling topics found.
        </p>
      ) : (
        <ul className="space-y-3">
          {counselingTopics.map((topic) => (
            <li
              key={topic.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100"
            >
              {editingTopicId === topic.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={editingTopicName}
                    onChange={(e) => setEditingTopicName(e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={() => handleSaveEdit(topic.id)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingTopicId(null)}
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <span className="text-gray-800 font-medium">{topic.name}</span>
              )}
              <div className="flex space-x-2">
                {editingTopicId !== topic.id && (
                  <Button
                    onClick={() => handleEdit(topic)}
                    variant="outline"
                    size="icon"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this counseling topic.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(topic.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
