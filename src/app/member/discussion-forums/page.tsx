"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  image?: string;
}

interface Feedback {
    userId: string;
    type: 'LIKE' | 'DISLIKE';
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: User;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  _count: { posts: number };
  topicFeedbacks: Feedback[];
  userFeedback?: "LIKE" | "DISLIKE" | null;
}

export default function DiscussionForumsPage() {
  const { data: session } = useSession();
  const [state, setState] = useState<{
    topics: ForumTopic[];
    newTopicTitle: string;
    newTopicContent: string;
    newTopicImageUrl: string;
    newTopicVideoUrl: string;
    loading: boolean;
    error: string | null;
    isCreatingTopic: boolean;
  }>({
    topics: [],
    newTopicTitle: "",
    newTopicContent: "",
    newTopicImageUrl: "",
    newTopicVideoUrl: "",
    loading: true,
    error: null,
    isCreatingTopic: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [topicToDeleteId, setTopicToDeleteId] = useState<string | null>(null);

  const {
    topics,
    newTopicTitle,
    newTopicContent,
    newTopicImageUrl,
    newTopicVideoUrl,
    loading,
    error,
    isCreatingTopic,
  } = state;

  const fetchTopics = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await safeFetch<ForumTopic[]>(
        "/api/discussion-forums/topics"
      );
      
      const topicsWithFeedback = data.map(topic => ({
          ...topic,
          userFeedback: topic.topicFeedbacks.find(fb => fb.userId === session?.user?.id)?.type || null
      }));

      setState((prev) => ({ ...prev, topics: topicsWithFeedback, loading: false }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message, loading: false }));
    } 
  };

  useEffect(() => {
    if(session) fetchTopics();
  }, [session]);

  const handleSubmitTopic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newTopicTitle.trim() ||
      !newTopicContent.trim() ||
      !session?.user?.id
    ) {
      setState((prev) => ({
        ...prev,
        error:
          "Please enter a title and content for your topic, and ensure you are logged in.",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isCreatingTopic: true }));

      await safeFetch("/api/discussion-forums/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTopicTitle,
          content: newTopicContent,
          userId: session.user.id,
          imageUrl: newTopicImageUrl || undefined,
          videoUrl: newTopicVideoUrl || undefined,
        }),
      });

      setState((prev) => ({
        ...prev,
        newTopicTitle: "",
        newTopicContent: "",
        newTopicImageUrl: "",
        newTopicVideoUrl: "",
        error: null,
        isCreatingTopic: false,
      }));

      await fetchTopics();
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message,
        isCreatingTopic: false,
      }));
    }
  };

  const handleFeedback = async (topicId: string, type: "LIKE" | "DISLIKE") => {
    if (!session?.user?.id) {
      alert("Please log in to give feedback.");
      return;
    }

    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) => {
        if (topic.id !== topicId) return topic;

        const { userFeedback, likes, dislikes } = topic;
        let newFeedback: 'LIKE' | 'DISLIKE' | null = userFeedback || null;
        let newLikes = likes;
        let newDislikes = dislikes;

        if (userFeedback === type) {
          type === "LIKE" ? newLikes-- : newDislikes--;
          newFeedback = null;
        } else if (userFeedback) {
          if (type === "LIKE") {
            newLikes++;
            newDislikes--;
          } else {
            newDislikes++;
            newLikes--;
          }
          newFeedback = type;
        } else {
          type === "LIKE" ? newLikes++ : newDislikes++;
          newFeedback = type;
        }

        return {
          ...topic,
          likes: newLikes,
          dislikes: newDislikes,
          userFeedback: newFeedback,
        };
      }),
    }));

    try {
      await safeFetch(`/api/discussion-forums/topics/${topicId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, type }),
      });
    } catch (err) {
      console.error("Feedback update failed:", err);
      fetchTopics();
    }
  };

  const onDeleteTopic = (topicId: string) => {
    setTopicToDeleteId(topicId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDeleteId) return;

    try {
      await safeFetch(`/api/discussion-forums/topics/${topicToDeleteId}`, {
        method: "DELETE",
      });

      setState((prev) => ({
        ...prev,
        topics: prev.topics.filter((topic) => topic.id !== topicToDeleteId),
      }));
      setTopicToDeleteId(null);
      setShowDeleteConfirm(false);
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message }));
      setTopicToDeleteId(null);
      setShowDeleteConfirm(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[\?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    return url.match(regex)?.[1] || null;
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Community Discussions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Connect, share knowledge, and grow together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {isCreatingTopic && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NewTopicCard
                    session={session}
                    state={{
                      newTopicTitle,
                      newTopicContent,
                      newTopicImageUrl,
                      newTopicVideoUrl,
                      error,
                    }}
                    handlers={{
                      setNewTopicTitle: (val) =>
                        setState((prev) => ({ ...prev, newTopicTitle: val })),
                      setNewTopicContent: (val) =>
                        setState((prev) => ({ ...prev, newTopicContent: val })),
                      setNewTopicImageUrl: (val) =>
                        setState((prev) => ({
                          ...prev,
                          newTopicImageUrl: val,
                        })),
                      setNewTopicVideoUrl: (val) =>
                        setState((prev) => ({
                          ...prev,
                          newTopicVideoUrl: val,
                        })),
                      cancel: () =>
                        setState((prev) => ({
                          ...prev,
                          isCreatingTopic: false,
                          newTopicTitle: "",
                          newTopicContent: "",
                          newTopicImageUrl: "",
                          newTopicVideoUrl: "",
                          error: null,
                        })),
                    }}
                    onSubmit={handleSubmitTopic}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!isCreatingTopic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={() =>
                    setState((prev) => ({ ...prev, isCreatingTopic: true }))
                  }
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </motion.div>
            )}

            <TopicsList
              topics={topics}
              session={session}
              handleFeedback={handleFeedback}
              getYouTubeVideoId={getYouTubeVideoId}
              onDeleteTopic={onDeleteTopic}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <CommunityGuidelines />
            <PopularTopics topics={topics} />
          </div>
        </div>

        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent className="rounded-2xl shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-gray-800">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete this
                discussion and all its associated comments and feedback.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg border-gray-200 hover:bg-gray-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTopic}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-full sm:w-48 rounded-lg" />

            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl shadow-lg" />
            <Skeleton className="h-64 w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-xl rounded-2xl">
        <CardContent className="p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full">
            <svg
              className="h-6 w-6 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Error Loading Discussions
          </h3>
          <p className="text-sm text-gray-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const NewTopicCard = ({
  session,
  state,
  handlers,
  onSubmit,
}: {
  session: any;
  state: {
    newTopicTitle: string;
    newTopicContent: string;
    newTopicImageUrl: string;
    newTopicVideoUrl: string;
    error: string | null;
  };
  handlers: {
    setNewTopicTitle: (val: string) => void;
    setNewTopicContent: (val: string) => void;
    setNewTopicImageUrl: (val: string) => void;
    setNewTopicVideoUrl: (val: string) => void;
    cancel: () => void;
  };
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
          New Discussion
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlers.cancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
      <CardDescription className="text-sm text-gray-600">
        Start a meaningful conversation with the community
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Topic Title"
          id="topicTitle"
          value={state.newTopicTitle}
          onChange={handlers.setNewTopicTitle}
          required
          disabled={!session?.user?.id}
          placeholder="What's your discussion about?"
          className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        <FormField
          label="Content"
          id="topicContent"
          value={state.newTopicContent}
          onChange={handlers.setNewTopicContent}
          component={Textarea}
          rows={5}
          required
          disabled={!session?.user?.id}
          placeholder="Share your thoughts, questions, or ideas..."
          className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Image URL (Optional)"
            id="topicImageUrl"
            type="url"
            value={state.newTopicImageUrl}
            onChange={handlers.setNewTopicImageUrl}
            placeholder="https://example.com/image.jpg"
            disabled={!session?.user?.id}
            className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <FormField
            label="YouTube Video (Optional)"
            id="topicVideoUrl"
            type="url"
            value={state.newTopicVideoUrl}
            onChange={handlers.setNewTopicVideoUrl}
            placeholder="https://youtube.com/watch?v=..."
            disabled={!session?.user?.id}
            className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm shadow-sm">
            {state.error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={handlers.cancel}
            className="rounded-lg border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!session?.user?.id}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Discussion
          </Button>
        </div>

        {!session?.user?.id && (
          <div className="text-center text-sm text-gray-500 pt-2">
            You need to{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              sign in
            </Link>{" "}
            to create a discussion
          </div>
        )}
      </form>
    </CardContent>
  </Card>
);

const FormField = ({
  label,
  id,
  value,
  onChange,
  component: Component = Input,
  ...props
}: {
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  component?: any;
  [key: string]: any;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {label}
    </label>
    <Component
      id={id}
      value={value}
      onChange={(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(e.target.value)}
      {...props}
    />
  </div>
);

const TopicsList = ({
  topics,
  session,
  handleFeedback,
  getYouTubeVideoId,
  onDeleteTopic,
}: {
  topics: ForumTopic[];
  session: any;
  handleFeedback: (topicId: string, type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
  onDeleteTopic: (topicId: string) => void;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
      Recent Discussions
    </h2>

    {topics.length > 0 ? (
      <div className="space-y-6">
        <AnimatePresence>
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TopicItem
                topic={topic}
                session={session}
                handleFeedback={handleFeedback}
                getYouTubeVideoId={getYouTubeVideoId}
                onDelete={onDeleteTopic}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ) : (
      <div className="text-center py-12 border rounded-2xl bg-white shadow-sm">
        <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800">
          No Discussions Yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to start a conversation!
        </p>
      </div>
    )}
  </div>
);

const TopicItem = ({
  topic,
  session,
  handleFeedback,
  getYouTubeVideoId,
  onDelete,
}: {
  topic: ForumTopic;
  session: any;
  handleFeedback: (topicId: string, type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
  onDelete: (topicId: string) => void;
}) => {
  const videoId = topic.videoUrl ? getYouTubeVideoId(topic.videoUrl) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent
        className="p-6 relative"
      >
        <Link href={`/member/discussion-forums/${topic.id}`} className="cursor-pointer">
        {session?.user?.id === topic.userId && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(topic.id);
                }}
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        )}
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={topic.user.image} alt={topic.user.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {topic.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {topic.title}
            </h3>

            <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1 space-x-2">
              <span>Posted by {topic.user.name || "Anonymous"}</span>
              <span className="mx-1">•</span>
              <span>
                {formatDistanceToNow(new Date(topic.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <p
              className={`mt-3 text-gray-600 text-sm sm:text-base ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {topic.content}
            </p>

            {topic.content.length > 300 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}

            <MediaContent
              imageUrl={topic.imageUrl}
              videoId={videoId}
              alt="Topic visual content"
            />
          </div>
        </div>
        </Link>
      </CardContent>
      <div className="px-6 pb-4 flex justify-between items-center">
        <FeedbackControls
          likes={topic.likes}
          dislikes={topic.dislikes}
          userFeedback={topic.userFeedback}
          onLike={() => handleFeedback(topic.id, "LIKE")}
          onDislike={() => handleFeedback(topic.id, "DISLIKE")}
          disabled={!session?.user?.id}
        />

        <div className="flex items-center text-sm text-gray-500">
          <MessageSquare className="w-4 h-4 mr-1.5" />
          {topic._count.posts} {topic._count.posts === 1 ? "reply" : "replies"}
        </div>
      </div>
    </Card>
  );
};

const MediaContent = ({
  imageUrl,
  videoId,
  alt,
}: {
  imageUrl?: string;
  videoId?: string | null;
  alt: string;
}) => {
  if (!imageUrl && !videoId) return null;

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {imageUrl && (
        <div className="relative aspect-video bg-gray-100">
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {videoId && (
        <div className="relative aspect-video bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

const FeedbackControls = ({
  likes,
  dislikes,
  userFeedback,
  onLike,
  onDislike,
  disabled,
}: {
  likes: number;
  dislikes: number;
  userFeedback?: "LIKE" | "DISLIKE" | null;
  onLike: () => void;
  onDislike: () => void;
  disabled: boolean;
}) => (
  <div className="flex items-center space-x-3">
    <FeedbackButton
      type="LIKE"
      count={likes}
      active={userFeedback === "LIKE"}
      onClick={onLike}
      disabled={disabled}
    />
    <FeedbackButton
      type="DISLIKE"
      count={dislikes}
      active={userFeedback === "DISLIKE"}
      onClick={onDislike}
      disabled={disabled}
    />
  </div>
);

const FeedbackButton = ({
  type,
  count,
  active,
  onClick,
  disabled,
}: {
  type: "LIKE" | "DISLIKE";
  count: number;
  active: boolean;
  onClick: () => void;
  disabled: boolean;
}) => {
  const Icon = type === "LIKE" ? ThumbsUp : ThumbsDown;
  const colorClass =
    type === "LIKE"
      ? active
        ? "text-blue-600 bg-blue-50"
        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
      : active
      ? "text-red-600 bg-red-50"
      : "text-gray-500 hover:text-red-600 hover:bg-red-50";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`flex items-center text-sm font-medium ${colorClass} rounded-full px-3 py-1.5 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {count}
    </button>
  );
};

const CommunityGuidelines = () => (
  <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
      <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
        Community Guidelines
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <ul className="space-y-3 text-sm text-gray-600">
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Be respectful and kind to others</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Share knowledge and ask thoughtful questions</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Keep discussions relevant and constructive</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Give credit when sharing others' work</span>
        </li>
      </ul>
    </CardContent>
  </Card>
);

const PopularTopics = ({ topics }: { topics: ForumTopic[] }) => {
  const popularTopics = [...topics]
    .sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes))
    .slice(0, 3);

  if (popularTopics.length === 0) return null;

  return (
    <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
          Popular Discussions
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Most engaged topics this week
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {popularTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/member/discussion-forums/${topic.id}`}
              className="block group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                    <span>{topic._count.posts} replies</span>
                    <span className="mx-1">•</span>
                    <span>{topic.likes} likes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

<style jsx>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }
`}</style>;