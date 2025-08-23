"use client";

import { useEffect, useState } from "react";
import { usePastoralCareStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, AlertTriangle, Loader2 } from "lucide-react";
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
        <Loader2 className="animate-spin h-5 w-5 text-blue-400" />
        <p className="ml-2 text-gray-300">Loading topics...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => fetchCounselingTopics(true)}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 h-full">
      <h2 className="text-2xl font-bold mb-4 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Manage Counseling Topics
      </h2>
      {counselingTopics.length === 0 ? (
        <p className="text-gray-400 py-4 text-center">
          No counseling topics found.
        </p>
      ) : (
        <ul className="space-y-3">
          {counselingTopics.map((topic) => (
            <li
              key={topic.id}
              className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg shadow-sm border border-gray-700"
            >
              {editingTopicId === topic.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={editingTopicName}
                    onChange={(e) => setEditingTopicName(e.target.value)}
                    className="flex-1 rounded-lg border-gray-700 focus:ring-blue-400 focus:border-blue-400 bg-gray-900 text-gray-200"
                  />
                  <Button
                    onClick={() => handleSaveEdit(topic.id)}
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingTopicId(null)}
                    variant="outline"
                    size="sm"
                    className="text-gray-300 hover:bg-gray-700/50 border-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <span className="text-white font-medium">{topic.name}</span>
              )}
              <div className="flex space-x-2">
                {editingTopicId !== topic.id && (
                  <Button
                    onClick={() => handleEdit(topic)}
                    variant="outline"
                    size="icon"
                    className="text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-700 hover:bg-red-800 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 text-white border-gray-700/50">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. This will permanently
                        delete this counseling topic.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-gray-300 hover:bg-gray-700/50 border-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(topic.id)}
                        className="bg-red-700 hover:bg-red-800 text-white"
                      >
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
