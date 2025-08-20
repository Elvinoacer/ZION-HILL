"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { safeFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

const BlogPostPage = () => {
  const { id } = useParams();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded-lg" />
            ))}
            <Skeleton className="h-4 w-3/4 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
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
                Error loading post
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Post not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The blog post you're looking for doesn't exist or may have been
            removed.
          </p>
          <div className="mt-6">
            <a
              href="/blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse all posts
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Post Header */}
        <header className="mb-12 text-center">
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {blogPost.tags.map((tag) => (
                <Badge key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blogPost.title}
          </h1>
          {(blogPost.publishedDate || blogPost.author) && (
            <div className="flex items-center justify-center space-x-4 text-gray-500">
              {blogPost.author && (
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {blogPost.author}
                </span>
              )}
              {blogPost.publishedDate && (
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(blogPost.publishedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {blogPost.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img
              src={blogPost.coverImage}
              alt={blogPost.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </div>

        {/* Post Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-center">
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg
                className="-ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to all posts
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPostPage;
