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
  userFeedback?: "LIKE" | "DISLIKE" | null;
}

export const DiscussionForumsPage = () => {
  const { data: session } = useSession();
  const [state, setState] = useState({
    topics: [] as ForumTopic[],
    newTopicTitle: "",
    newTopicContent: "",
    newTopicImageUrl: "",
    newTopicVideoUrl: "",
    loading: true,
    error: null as string | null,
    isCreatingTopic: false,
  });

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
      const topicsWithFeedback = await Promise.all(
        data.map(async (topic) => {
          if (!session?.user?.id) return { ...topic, userFeedback: null };

          try {
            const feedbackRes = await safeFetch<{
              type: "LIKE" | "DISLIKE";
            } | null>(
              `/api/discussion-forums/topics/${topic.id}/user-feedback?userId=${session.user.id}`
            );
            return { ...topic, userFeedback: feedbackRes?.type || null };
          } catch {
            return { ...topic, userFeedback: null };
          }
        })
      );

      setState((prev) => ({ ...prev, topics: topicsWithFeedback }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchTopics();
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
        let newFeedback = userFeedback;
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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Community Discussions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect, share knowledge, and grow together
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      setState((prev) => ({ ...prev, newTopicImageUrl: val })),
                    setNewTopicVideoUrl: (val) =>
                      setState((prev) => ({ ...prev, newTopicVideoUrl: val })),
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
                className="w-full sm:w-auto"
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
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CommunityGuidelines />
          <PopularTopics topics={topics} />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-full" />

          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
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
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">
            Error loading discussions
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-red-700 hover:text-red-600"
            >
              Try again <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
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
  <Card className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">New Discussion</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlers.cancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
      <CardDescription>
        Start a meaningful conversation with the community
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Topic Title"
          id="topicTitle"
          value={state.newTopicTitle}
          onChange={handlers.setNewTopicTitle}
          required
          disabled={!session?.user?.id}
          placeholder="What's your discussion about?"
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
          />

          <FormField
            label="YouTube Video (Optional)"
            id="topicVideoUrl"
            type="url"
            value={state.newTopicVideoUrl}
            onChange={handlers.setNewTopicVideoUrl}
            placeholder="https://youtube.com/watch?v=..."
            disabled={!session?.user?.id}
          />
        </div>

        {state.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="outline" type="button" onClick={handlers.cancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!session?.user?.id}>
            Post Discussion
          </Button>
        </div>

        {!session?.user?.id && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            You need to{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
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
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <Component
      id={id}
      value={value}
      onChange={(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(e.target.value)}
      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      {...props}
    />
  </div>
);

const TopicsList = ({
  topics,
  session,
  handleFeedback,
  getYouTubeVideoId,
}: {
  topics: ForumTopic[];
  session: any;
  handleFeedback: (topicId: string, type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
      Recent Discussions
    </h2>

    {topics.length > 0 ? (
      <div className="space-y-4">
        <AnimatePresence>
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TopicItem
                topic={topic}
                session={session}
                handleFeedback={handleFeedback}
                getYouTubeVideoId={getYouTubeVideoId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600">
          <MessageSquare className="w-full h-full" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          No discussions yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
}: {
  topic: ForumTopic;
  session: any;
  handleFeedback: (topicId: string, type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
}) => {
  const videoId = topic.videoUrl ? getYouTubeVideoId(topic.videoUrl) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/discussion-forums/${topic.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
              <AvatarImage src={topic.user.image} alt={topic.user.name} />
              <AvatarFallback>
                {topic.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {topic.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Posted by {topic.user.name || "Anonymous"}</span>
                <span className="mx-2">•</span>
                <span>
                  {formatDistanceToNow(new Date(topic.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p
                className={`mt-3 text-gray-600 dark:text-gray-300 ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {topic.content}
              </p>

              {topic.content.length > 300 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setExpanded(!expanded);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
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
        </CardContent>
      </Link>

      <div className="px-6 pb-4 flex justify-between items-center">
        <FeedbackControls
          likes={topic.likes}
          dislikes={topic.dislikes}
          userFeedback={topic.userFeedback}
          onLike={() => handleFeedback(topic.id, "LIKE")}
          onDislike={() => handleFeedback(topic.id, "DISLIKE")}
          disabled={!session?.user?.id}
        />

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
    <div className="mt-4 rounded-lg overflow-hidden">
      {imageUrl && (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg">
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {videoId && (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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
  <div className="flex items-center space-x-4">
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
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      : active
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`flex items-center text-sm font-medium ${colorClass} transition-colors rounded-full px-3 py-1.5 ${
        active
          ? "bg-blue-50 dark:bg-blue-900/30"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {count}
    </button>
  );
};

const CommunityGuidelines = () => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="text-lg">Community Guidelines</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
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
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Popular Discussions</CardTitle>
        <CardDescription>Most engaged topics this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/discussion-forums/${topic.id}`}
              className="block group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg p-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{topic._count.posts} replies</span>
                    <span className="mx-1.5">•</span>
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

export default DiscussionForumsPage;
