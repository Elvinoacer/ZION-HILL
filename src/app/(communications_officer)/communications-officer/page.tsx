"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBlog, FaBullhorn, FaHashtag } from "react-icons/fa";
import { FiExternalLink, FiPlus } from "react-icons/fi";

interface Announcement {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

const CommunicationsOfficerDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementTags, setNewAnnouncementTags] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls with Promise.all for parallel loading
        const [announcementsRes, blogPostsRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/blog"),
        ]);

        if (!announcementsRes.ok)
          throw new Error("Failed to fetch announcements");
        if (!blogPostsRes.ok) throw new Error("Failed to fetch blog posts");

        const [announcementsData, blogPostsData] = await Promise.all([
          announcementsRes.json(),
          blogPostsRes.json(),
        ]);

        setAnnouncements(announcementsData);
        setBlogPosts(blogPostsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAnnouncementTitle,
          content: newAnnouncementContent,
          tags: newAnnouncementTags.split(",").map((tag) => tag.trim()),
        }),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      const newAnn = await res.json();
      setAnnouncements((prev) => [newAnn, ...prev]);
      setNewAnnouncementTitle("");
      setNewAnnouncementContent("");
      setNewAnnouncementTags("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Communications Dashboard
            </h1>
            <div className="flex justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
                <p className="text-lg text-gray-600">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Communications Dashboard
            </h1>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">Error: {error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            Communications Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage church brand stewardship and multiplatform engagement with
            our comprehensive communication tools.
          </p>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
              <FaBullhorn className="text-white text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-white">
                Announcements
              </h2>
              <span className="ml-auto bg-white text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {announcements.length}
              </span>
            </div>
            <div className="p-6">
              {announcements.length > 0 ? (
                <ul className="space-y-4">
                  {announcements.map((announcement) => (
                    <li
                      key={announcement.id}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {announcement.title}
                          </h3>
                          {announcement.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {announcement.tags.map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  <FaHashtag className="mr-1" size={10} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={announcement.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          aria-label="View announcement"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No announcements found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Blog Posts Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center">
              <FaBlog className="text-white text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
              <span className="ml-auto bg-white text-purple-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {blogPosts.length}
              </span>
            </div>
            <div className="p-6">
              {blogPosts.length > 0 ? (
                <ul className="space-y-4">
                  {blogPosts.map((post) => (
                    <li
                      key={post.id}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {post.title}
                          </h3>
                          {post.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  <FaHashtag className="mr-1" size={10} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          href={`/communications-officer/edit-blog-post/${post.id}`}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          aria-label="Edit blog post"
                        >
                          <FiExternalLink />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blog posts found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Create Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Create Announcement Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiPlus className="mr-2" />
                  Create Announcement
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <label
                      htmlFor="announcementTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="announcementTitle"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAnnouncementTitle}
                      onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                      required
                      placeholder="Enter announcement title..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="announcementContent"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Content
                    </label>
                    <textarea
                      id="announcementContent"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      value={newAnnouncementContent}
                      onChange={(e) =>
                        setNewAnnouncementContent(e.target.value)
                      }
                      required
                      placeholder="Write your announcement content..."
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="announcementTags"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="announcementTags"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAnnouncementTags}
                      onChange={(e) => setNewAnnouncementTags(e.target.value)}
                      placeholder="e.g. event, worship, prayer"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create Announcement
                  </button>
                </form>
              </div>
            </div>

            {/* Create Blog Post Button */}
            <Link
              href="/communications-officer/create-blog-post"
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-center">
                  <div className="flex flex-col items-center">
                    <FiPlus className="text-white text-2xl mb-2" />
                    <h2 className="text-xl font-semibold text-white">
                      Create Blog Post
                    </h2>
                    <p className="text-white text-opacity-90 mt-1">
                      Use our rich text editor
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Unified Publishing Console */}
      </div>
    </div>
  );
};

export default CommunicationsOfficerDashboard;
