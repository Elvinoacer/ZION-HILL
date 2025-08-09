"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  url: string;
  tags: string[];
  // Add other blog post fields as needed
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await safeFetch<BlogPost[]>('/api/blog');
        setBlogPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Blog</h1>
        <p className="text-lg text-gray-600">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Blog</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Blog</h1>
      <p className="text-lg text-gray-600 mb-4">
        Stay updated with our latest news and articles.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Tags: {post.tags.join(', ')}</p>
                <p className="text-gray-600">
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Read More
                  </a>
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No blog posts available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
