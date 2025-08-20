"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { safeFetch } from "@/lib/api";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowLeft,
  Image as ImageIcon,
  Youtube,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface User {
  name: string;
  image?: string;
}

interface ForumContent {
  id: string;
  content: string;
  userId: string;
  user: User;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  userFeedback?: "LIKE" | "DISLIKE" | null;
}

interface ForumTopic extends ForumContent {
  title: string;
}

interface ForumPost extends ForumContent {}

const TopicPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const topicId = params.topicId as string;

  const [state, setState] = useState({
    topic: null as ForumTopic | null,
    posts: [] as ForumPost[],
    newPostContent: "",
    newPostImageUrl: "",
    newPostVideoUrl: "",
    loading: true,
    error: null as string | null,
    isSubmitting: false,
  });

  const {
    topic,
    posts,
    newPostContent,
    newPostImageUrl,
    newPostVideoUrl,
    loading,
    error,
    isSubmitting,
  } = state;

  const fetchTopicAndPosts = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const topicData = await safeFetch<ForumTopic[]>(
        `/api/discussion-forums/topics?id=${topicId}`
      );
      const fetchedTopic = await addUserFeedback(topicData[0] || null, "topic");

      const postsData = await safeFetch<ForumPost[]>(
        `/api/discussion-forums/topics/${topicId}/posts`
      );
      const postsWithFeedback = await Promise.all(
        postsData.map((post) => addUserFeedback(post, "post"))
      );

      setState((prev) => ({
        ...prev,
        topic: fetchedTopic,
        posts: postsWithFeedback,
        loading: false,
      }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message, loading: false }));
    }
  };

  const addUserFeedback = async <T extends ForumContent>(
    content: T | null,
    type: "topic" | "post"
  ) => {
    if (!content || !session?.user?.id) return content;

    try {
      const endpoint =
        type === "topic"
          ? `/api/discussion-forums/topics/${content.id}/user-feedback?userId=${session.user.id}`
          : `/api/discussion-forums/posts/${content.id}/user-feedback?userId=${session.user.id}`;

      const feedbackRes = await safeFetch<{ type: "LIKE" | "DISLIKE" } | null>(
        endpoint
      );
      return { ...content, userFeedback: feedbackRes?.type || null };
    } catch (error) {
      console.error(`Error fetching user feedback for ${type}:`, error);
      return { ...content, userFeedback: null };
    }
  };

  useEffect(() => {
    if (topicId) fetchTopicAndPosts();
  }, [topicId, session]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPostContent.trim() || !session?.user?.id) {
      setState((prev) => ({
        ...prev,
        error:
          "Please enter content for your post, and ensure you are logged in.",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isSubmitting: true }));

      await safeFetch(`/api/discussion-forums/topics/${topicId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent,
          userId: session.user.id,
          imageUrl: newPostImageUrl || undefined,
          videoUrl: newPostVideoUrl || undefined,
        }),
      });

      setState((prev) => ({
        ...prev,
        newPostContent: "",
        newPostImageUrl: "",
        newPostVideoUrl: "",
        error: null,
        isSubmitting: false,
      }));

      await fetchTopicAndPosts();
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message,
        isSubmitting: false,
      }));
    }
  };

  const handleFeedback = async (
    id: string,
    type: "LIKE" | "DISLIKE",
    contentType: "topic" | "post"
  ) => {
    if (!session?.user?.id) {
      alert("Please log in to give feedback.");
      return;
    }

    if (contentType === "topic" && topic) {
      setState((prev) => ({
        ...prev,
        topic: updateFeedback(prev.topic, type),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === id ? updateFeedback(post, type) : post
        ),
      }));
    }

    try {
      const endpoint =
        contentType === "topic"
          ? `/api/discussion-forums/topics/${id}/feedback`
          : `/api/discussion-forums/posts/${id}/feedback`;

      await safeFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, type }),
      });
    } catch (err) {
      console.error(`Failed to update ${contentType} feedback:`, err);
      fetchTopicAndPosts();
    }
  };

  const updateFeedback = <T extends ForumContent>(
    content: T | null,
    type: "LIKE" | "DISLIKE"
  ) => {
    if (!content) return null;

    const { userFeedback, likes, dislikes } = content;
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
      ...content,
      likes: newLikes,
      dislikes: newDislikes,
      userFeedback: newFeedback,
    };
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

  if (!topic) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BackButton />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <TopicCard
              topic={topic}
              session={session}
              handleFeedback={(type) => handleFeedback(topic.id, type, "topic")}
              getYouTubeVideoId={getYouTubeVideoId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Community Responses
            </h2>

            {posts.length > 0 ? (
              <div className="space-y-6 mt-4">
                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PostCard
                        post={post}
                        session={session}
                        handleFeedback={(postId, type) =>
                          handleFeedback(postId, type, "post")
                        }
                        getYouTubeVideoId={getYouTubeVideoId}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-800/50 mt-4">
                <div className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4">
                  <MessageSquare className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No responses yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Be the first to share your thoughts
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <NewPostCard
              session={session}
              state={{
                newPostContent,
                newPostImageUrl,
                newPostVideoUrl,
                error,
              }}
              handlers={{
                setNewPostContent: (val) =>
                  setState((prev) => ({ ...prev, newPostContent: val })),
                setNewPostImageUrl: (val) =>
                  setState((prev) => ({ ...prev, newPostImageUrl: val })),
                setNewPostVideoUrl: (val) =>
                  setState((prev) => ({ ...prev, newPostVideoUrl: val })),
              }}
              onSubmit={handleSubmitPost}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RelatedTopicsCard currentTopicId={topicId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CommunityGuidelinesCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="space-y-8">
      <Skeleton className="h-10 w-48" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex space-x-4 pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <Skeleton className="h-12 w-36" />

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
              <div className="flex justify-between pt-2">
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
            Error loading topic
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

const NotFoundState = () => (
  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <MessageSquare className="w-full h-full" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Topic Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        The discussion you're looking for doesn't exist or may have been
        removed.
      </p>
      <Link href="/discussion-forums">
        <Button>Browse All Discussions</Button>
      </Link>
    </div>
  </div>
);

const BackButton = () => (
  <Link href="/discussion-forums">
    <Button variant="outline" className="mb-6">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Discussions
    </Button>
  </Link>
);

const TopicCard = ({
  topic,
  session,
  handleFeedback,
  getYouTubeVideoId,
}: {
  topic: ForumTopic;
  session: any;
  handleFeedback: (type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
}) => {
  const videoId = topic.videoUrl ? getYouTubeVideoId(topic.videoUrl) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
            <AvatarImage src={topic.user.image} alt={topic.user.name} />
            <AvatarFallback>{topic.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {topic.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Posted by {topic.user.name || "Anonymous"}</span>
              <span className="mx-2">•</span>
              <span>
                {formatDistanceToNow(new Date(topic.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="mt-4">
              <p
                className={`text-gray-600 dark:text-gray-300 ${
                  expanded ? "" : "line-clamp-4"
                }`}
              >
                {topic.content}
              </p>

              {topic.content.length > 400 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <MediaContent
              imageUrl={topic.imageUrl}
              videoId={videoId}
              alt="Topic visual content"
            />

            <div className="flex justify-between items-center mt-6">
              <FeedbackControls
                likes={topic.likes}
                dislikes={topic.dislikes}
                userFeedback={topic.userFeedback}
                onLike={() => handleFeedback("LIKE")}
                onDislike={() => handleFeedback("DISLIKE")}
                disabled={!session?.user?.id}
              />

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                {topic._count.posts}{" "}
                {topic._count.posts === 1 ? "response" : "responses"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PostCard = ({
  post,
  session,
  handleFeedback,
  getYouTubeVideoId,
}: {
  post: ForumPost;
  session: any;
  handleFeedback: (postId: string, type: "LIKE" | "DISLIKE") => void;
  getYouTubeVideoId: (url: string) => string | null;
}) => {
  const videoId = post.videoUrl ? getYouTubeVideoId(post.videoUrl) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage src={post.user.image} alt={post.user.name} />
            <AvatarFallback>{post.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{post.user.name || "Anonymous"}</span>
              <span className="mx-2">•</span>
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="mt-3">
              <p
                className={`text-gray-600 dark:text-gray-300 ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {post.content}
              </p>

              {post.content.length > 300 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <MediaContent
              imageUrl={post.imageUrl}
              videoId={videoId}
              alt="Post image"
            />

            <div className="flex justify-between items-center mt-4">
              <FeedbackControls
                likes={post.likes}
                dislikes={post.dislikes}
                userFeedback={post.userFeedback}
                onLike={() => handleFeedback(post.id, "LIKE")}
                onDislike={() => handleFeedback(post.id, "DISLIKE")}
                disabled={!session?.user?.id}
              />
            </div>
          </div>
        </div>
      </CardContent>
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
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {imageUrl && (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
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

const NewPostCard = ({
  session,
  state,
  handlers,
  onSubmit,
  isSubmitting,
}: {
  session: any;
  state: {
    newPostContent: string;
    newPostImageUrl: string;
    newPostVideoUrl: string;
    error: string | null;
  };
  handlers: {
    setNewPostContent: (val: string) => void;
    setNewPostImageUrl: (val: string) => void;
    setNewPostVideoUrl: (val: string) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="text-xl">Add Your Response</CardTitle>
      <CardDescription>
        Share your thoughts, insights, or questions
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Your Response"
          id="postContent"
          value={state.newPostContent}
          onChange={handlers.setNewPostContent}
          component={Textarea}
          rows={5}
          required
          disabled={!session?.user?.id || isSubmitting}
          placeholder="Write your response here..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={
              <span className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image URL
              </span>
            }
            id="postImageUrl"
            type="url"
            value={state.newPostImageUrl}
            onChange={handlers.setNewPostImageUrl}
            placeholder="https://example.com/image.jpg"
            disabled={!session?.user?.id || isSubmitting}
          />

          <FormField
            label={
              <span className="flex items-center">
                <Youtube className="w-4 h-4 mr-2" />
                YouTube Video
              </span>
            }
            id="postVideoUrl"
            type="url"
            value={state.newPostVideoUrl}
            onChange={handlers.setNewPostVideoUrl}
            placeholder="https://youtube.com/watch?v=..."
            disabled={!session?.user?.id || isSubmitting}
          />
        </div>

        {state.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={!session?.user?.id || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Response"}
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
            to post a response
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
  label: string | React.ReactNode;
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

const CommunityGuidelinesCard = () => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="text-lg">Community Guidelines</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Be respectful and constructive</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Share knowledge and ask thoughtful questions</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Keep discussions relevant and helpful</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 text-green-500 mr-2 mt-0.5">✓</span>
          <span>Give credit when referencing others' work</span>
        </li>
      </ul>
    </CardContent>
  </Card>
);

const RelatedTopicsCard = ({ currentTopicId }: { currentTopicId: string }) => {
  const [relatedTopics, setRelatedTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await safeFetch<ForumTopic[]>(
          `/api/discussion-forums/topics/related?excludeId=${currentTopicId}`
        );
        setRelatedTopics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentTopicId) {
      fetchRelated();
    }
  }, [currentTopicId]);

  if (loading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Related Discussions</CardTitle>
          <CardDescription>Explore similar topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Related Discussions</CardTitle>
          <CardDescription>Explore similar topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading related topics: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (relatedTopics.length === 0) {
    return null; // Or a message indicating no related topics
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Related Discussions</CardTitle>
        <CardDescription>Explore similar topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedTopics.map((topic) => (
            <Link key={topic.id} href={`/discussion-forums/${topic.id}`} className="block group">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg p-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{topic._count.posts} responses</span>
                    <span className="mx-1.5"> • </span>
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

export default TopicPage;
