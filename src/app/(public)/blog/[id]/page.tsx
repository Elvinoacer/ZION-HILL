"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { safeFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  publishedDate?: string;
  author?: string;
  excerpt?: string;
  coverImage?: string;
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  text: string;
}

interface SocialShareIconProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface ErrorStateProps {
  message: string;
}

const BlogPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlogPost = async () => {
        try {
          const data = await safeFetch<BlogPost>(`/api/blog?id=${id}`);
          setBlogPost(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBlogPost();
    }
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!blogPost) return <NotFoundState />;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {blogPost.coverImage && (
          <header className="relative h-56 sm:h-64 md:h-80 lg:h-96">
            <Image
              src={blogPost.coverImage}
              alt={blogPost.title}
              fill
              className="z-0 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-12 z-10 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {blogPost.title}
              </h1>
            </div>
          </header>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
          {!blogPost.coverImage && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              {blogPost.title}
            </h1>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-4 mb-6 sm:mb-8 text-gray-500 border-y py-3 sm:py-4">
            {blogPost.author && <InfoItem icon={User} text={blogPost.author} />}
            {blogPost.publishedDate && (
              <InfoItem
                icon={Calendar}
                text={new Date(blogPost.publishedDate).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              />
            )}
            {blogPost.tags?.length > 0 && (
              <InfoItem icon={Tag} text={blogPost.tags.join(", ")} />
            )}
          </div>

          <div className="prose prose-base sm:prose-lg md:prose-xl max-w-none mx-auto text-gray-700 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>

          <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <button
              onClick={() => router.push("/blog")}
              className="flex items-center gap-1.5 sm:gap-2 text-blue-600 font-semibold hover:underline text-sm sm:text-base"
            >
              <ArrowLeft size={18} /> Back to Blog
            </button>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-semibold text-sm sm:text-base">Share:</span>
              <div className="flex gap-1.5 sm:gap-2">
                <SocialShareIcon icon={Twitter} />
                <SocialShareIcon icon={Facebook} />
                <SocialShareIcon icon={Linkedin} />
              </div>
            </div>
          </footer>
        </div>
      </motion.article>
    </div>
  );
};

// Helper Components
const InfoItem = ({ icon: Icon, text }: InfoItemProps) => (
  <div className="flex items-center gap-1.5">
    <Icon className="h-4 w-4 text-gray-400" />
    <span className="text-sm">{text}</span>
  </div>
);

const SocialShareIcon = ({ icon: Icon }: SocialShareIconProps) => (
  <button className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors">
    <Icon size={18} />
  </button>
);

// State Components
const LoadingState = () => (
  <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl animate-pulse">
    <Skeleton className="h-64 sm:h-80 md:h-96 w-full rounded-lg mb-8 sm:mb-12" />
    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
    <div className="space-y-2 sm:space-y-3">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i % 3 === 0 ? "w-5/6" : "w-full"}`}
        />
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }: ErrorStateProps) => (
  <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
    <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
      Failed to Load Post
    </h2>
    <p className="text-red-500 mb-4 sm:mb-6 text-sm sm:text-base">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-5 py-2 sm:px-6 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
    >
      Try Again
    </button>
  </div>
);

const NotFoundState = () => (
  <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
      Post Not Found
    </h2>
    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      The post you are looking for does not exist or has been moved.
    </p>
    <button
      onClick={() => (window.location.href = "/blog")}
      className="px-5 py-2 sm:px-6 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
    >
      Back to Blog
    </button>
  </div>
);

export default BlogPostPage;
