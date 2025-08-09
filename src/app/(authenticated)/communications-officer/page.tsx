"use client";

import React, { useEffect, useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

interface BlogPost {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

const CommunicationsOfficerDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Announcements
        const announcementsRes = await fetch('/api/announcements');
        if (!announcementsRes.ok) throw new Error('Failed to fetch announcements');
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData);

        // Fetch Blog Posts
        const blogPostsRes = await fetch('/api/blog');
        if (!blogPostsRes.ok) throw new Error('Failed to fetch blog posts');
        const blogPostsData = await blogPostsRes.json();
        setBlogPosts(blogPostsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Communications Officer Dashboard</h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Communications Officer Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Communications Officer Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage church brand stewardship and multiplatform engagement.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Announcements</h2>
          {announcements.length > 0 ? (
            <ul>
              {announcements.map((announcement) => (
                <li key={announcement.id} className="mb-2">
                  <strong>{announcement.title}</strong>
                  <p className="text-gray-600 text-sm">Tags: {announcement.tags.join(', ')}</p>
                  <a href={announcement.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Announcement
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Blog Posts</h2>
          {blogPosts.length > 0 ? (
            <ul>
              {blogPosts.map((post) => (
                <li key={post.id} className="mb-2">
                  <strong>{post.title}</strong>
                  <p className="text-gray-600 text-sm">Tags: {post.tags.join(', ')}</p>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Read Post
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No blog posts found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Content Creation & Distribution</h2>
          <p>Unified publishing console and brand asset management.</p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsOfficerDashboard;