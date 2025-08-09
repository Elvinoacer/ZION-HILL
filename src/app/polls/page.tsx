"use client";

import { useEffect } from "react";
import { usePollStore } from "@/store/pollStore";
import PollCard from "@/components/PollCard";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Loader2,
  BarChart2,
  PenTool,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PollsPage() {
  const { data: session, status } = useSession();
  const { polls, fetchPolls, createPoll } = usePollStore();
  const [newPollTitle, setNewPollTitle] = useState("");
  const [newPollDescription, setNewPollDescription] = useState("");
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoading(true);
      await fetchPolls();
      setIsLoading(false);
    };
    loadPolls();
  }, [fetchPolls]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollTitle || newPollOptions.some((opt) => !opt.trim())) {
      return;
    }

    setIsCreating(true);
    try {
      await createPoll(
        {
          title: newPollTitle,
          description: newPollDescription,
          options: newPollOptions.filter((opt) => opt.trim() !== ""),
        },
        session?.user?.id || ""
      );

      setNewPollTitle("");
      setNewPollDescription("");
      setNewPollOptions(["", ""]);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };

  const addOption = () => {
    setNewPollOptions([...newPollOptions, ""]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = newPollOptions.filter((_, i) => i !== index);
    setNewPollOptions(updatedOptions);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Polls
          </h1>
          <p className="text-lg text-gray-600">
            Share your opinions and see what others think
          </p>
        </motion.div>

        {/* Create Poll Form */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Create New Poll
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="pollTitle"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Poll Title
                    </label>
                    <Input
                      id="pollTitle"
                      type="text"
                      placeholder="What's your poll about?"
                      value={newPollTitle}
                      onChange={(e) => setNewPollTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="pollDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description (Optional)
                    </label>
                    <Textarea
                      id="pollDescription"
                      placeholder="Add more context about your poll..."
                      value={newPollDescription}
                      onChange={(e) => setNewPollDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <div className="space-y-2">
                      {newPollOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            required
                            className="flex-1"
                          />
                          {newPollOptions.length > 2 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="mt-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Create Poll
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Polls List Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Current Polls
            </h2>
            <Badge variant="outline" className="text-gray-600">
              {polls.length} {polls.length === 1 ? "Poll" : "Polls"}
            </Badge>
          </div>

          {polls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm"
            >
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <BarChart2 className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No polls yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {session?.user
                  ? "Create the first poll!"
                  : "Sign in to create the first poll!"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {polls.map((poll) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    layout
                    whileHover={{ y: -5 }}
                  >
                    <PollCard poll={poll} userId={session?.user?.id || null} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
