"use client";

import { useEffect, useState } from "react";
import { usePollStore } from "@/store/pollStore";
import PollCard from "@/components/PollCard";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Loader2,
  BarChart2,
  PenTool,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export default function PollsPage() {
  const { data: session, status } = useSession();
  const { polls, fetchPolls, createPoll } = usePollStore();
  const [newPollTitle, setNewPollTitle] = useState("");
  const [newPollDescription, setNewPollDescription] = useState("");
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoading(true);
      await fetchPolls();
      setIsLoading(false);
    };
    if (status !== 'loading') {
      loadPolls();
    }
  }, [fetchPolls, status]);

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
      setCreateFormVisible(false);
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
    if (newPollOptions.length < 5) {
        setNewPollOptions([...newPollOptions, ""]);
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = newPollOptions.filter((_, i) => i !== index);
    setNewPollOptions(updatedOptions);
  };

  if (status === "loading" || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Community Voice
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Engage in discussions, cast your vote, and shape our community together.
          </p>
        </motion.div>

        {session?.user?.roles?.includes("ADMIN") && (
          <motion.div layout className="mb-8">
            <Card className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader 
                className="cursor-pointer p-4 sm:p-6 flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800/80"
                onClick={() => setCreateFormVisible(!isCreateFormVisible)}
              >
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <PenTool className="h-5 w-5 text-indigo-500" />
                  Create a New Poll
                </CardTitle>
                {isCreateFormVisible ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
              </CardHeader>
              <AnimatePresence>
                {isCreateFormVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-4 sm:p-6 space-y-6">
                      <form onSubmit={handleCreatePoll} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="pollTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poll Title</label>
                          <Input id="pollTitle" type="text" placeholder="What question do you want to ask?" value={newPollTitle} onChange={(e) => setNewPollTitle(e.target.value)} required className="dark:bg-gray-700 dark:border-gray-600" />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="pollDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                          <Textarea id="pollDescription" placeholder="Provide some context or details..." value={newPollDescription} onChange={(e) => setNewPollDescription(e.target.value)} rows={3} className="dark:bg-gray-700 dark:border-gray-600" />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                          {newPollOptions.map((option, index) => (
                            <motion.div key={index} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
                              <Input type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required className="flex-1 dark:bg-gray-700 dark:border-gray-600" />
                              {newPollOptions.length > 2 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                           {newPollOptions.length < 5 && (
                            <Button type="button" variant="outline" onClick={addOption} className="mt-2 border-dashed dark:border-gray-600 dark:text-gray-400">
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                            </Button>
                           )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isCreating} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                {isCreating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Publishing...</> : <><CheckCircle className="h-4 w-4 mr-2" /> Publish Poll</>}
                            </Button>
                        </div>
                      </form>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <BarChart2 className="h-7 w-7 text-indigo-500" />
              Active Polls
            </h2>
            <Badge variant="secondary" className="text-base py-1 px-3 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              {polls.length} {polls.length === 1 ? "Poll" : "Polls"} Available
            </Badge>
          </div>

          {polls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm"
            >
              <BarChart2 className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                No Active Polls
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {session?.user?.roles?.includes("ADMIN")
                  ? "Why not create one and get the conversation started?"
                  : "Come back soon to see new polls and share your thoughts."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence>
                {polls.map((poll) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    layout
                    transition={{ duration: 0.3 }}
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
