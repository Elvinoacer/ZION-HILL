"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaBlog,
  FaBullhorn,
  FaHashtag,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  FiExternalLink,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiArrowUpRight,
  FiMail,
  FiX,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

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
  const [refreshing, setRefreshing] = useState(false);

  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementTags, setNewAnnouncementTags] = useState("");
  const [sendToAll, setSendToAll] = useState(false);

  // Stats data
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    totalBlogPosts: 0,
    engagementRate: "78%",
    scheduledContent: 3,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
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
      setStats({
        totalAnnouncements: announcementsData.length,
        totalBlogPosts: blogPostsData.length,
        engagementRate: "78%",
        scheduledContent: 3,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating announcement...");
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
      setStats((prev) => ({
        ...prev,
        totalAnnouncements: prev.totalAnnouncements + 1,
      }));
      toast.success("Announcement created successfully", { id: toastId });

      if (sendToAll) {
        const sendToastId = toast.loading(
          "Sending announcement to all members..."
        );
        try {
          const sendRes = await fetch("/api/announcements/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: newAnnouncementTitle,
              content: newAnnouncementContent,
            }),
          });
          if (!sendRes.ok) throw new Error("Failed to send announcement");
          toast.success("Announcement sent to all members successfully", {
            id: sendToastId,
          });
        } catch (err: any) {
          setError(err.message);
          toast.error("Failed to send announcement", { id: sendToastId });
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to create announcement", { id: toastId });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/announcements?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete announcement");
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
      setStats((prev) => ({
        ...prev,
        totalAnnouncements: prev.totalAnnouncements - 1,
      }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog post");
      setBlogPosts((prev) => prev.filter((post) => post.id !== id));
      setStats((prev) => ({
        ...prev,
        totalBlogPosts: prev.totalBlogPosts - 1,
      }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
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
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-center" />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Communications Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                Manage church brand stewardship and multiplatform engagement
                with our comprehensive communication tools.
              </p>
            </div>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw
                className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <FaBullhorn className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalAnnouncements}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Announcements
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                  <FaBlog className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalBlogPosts}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Blog Posts
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <FaChartLine className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.engagementRate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Engagement Rate
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-3">
                  <FaCalendarAlt className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.scheduledContent}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scheduled
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start"
            >
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
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
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <FiX className="h-4 w-4 text-red-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden lg:col-span-2"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
              <FaBullhorn className="text-white text-xl mr-3" />
              <h2 className="text-lg font-semibold text-white">
                Recent Announcements
              </h2>
              <span className="ml-auto bg-white text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {announcements.length}
              </span>
            </div>
            <div className="p-4">
              {announcements.length > 0 ? (
                <ul className="space-y-3">
                  {announcements.slice(0, 5).map((announcement) => (
                    <li
                      key={announcement.id}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 dark:text-white line-clamp-1">
                            {announcement.title}
                          </h3>
                          {announcement.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {announcement.tags
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <span
                                    key={`${tag}-${index}`}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                  >
                                    <FaHashtag className="mr-1" size={10} />
                                    {tag}
                                  </span>
                                ))}
                              {announcement.tags.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  +{announcement.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <a
                            href={announcement.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            aria-label="View announcement"
                          >
                            <FiExternalLink size={16} />
                          </a>
                          <button
                            onClick={() =>
                              handleDeleteAnnouncement(announcement.id)
                            }
                            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            aria-label="Delete announcement"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No announcements found
                  </p>
                </div>
              )}
              {announcements.length > 5 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href="/communications-officer/announcements"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                  >
                    View all announcements <FiArrowUpRight className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Blog Posts Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden lg:col-span-1"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center">
              <FaBlog className="text-white text-xl mr-3" />
              <h2 className="text-lg font-semibold text-white">
                Recent Blog Posts
              </h2>
              <span className="ml-auto bg-white text-purple-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {blogPosts.length}
              </span>
            </div>
            <div className="p-4">
              {blogPosts.length > 0 ? (
                <ul className="space-y-3">
                  {blogPosts.slice(0, 5).map((post) => (
                    <li
                      key={post.id}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 dark:text-white line-clamp-1">
                            {post.title}
                          </h3>
                          {post.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                >
                                  <FaHashtag className="mr-1" size={10} />
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  +{post.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Link
                            href={`/communications-officer/edit-blog-post/${post.id}`}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            aria-label="Edit blog post"
                          >
                            <FiEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            aria-label="Delete blog post"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No blog posts found
                  </p>
                </div>
              )}
              {blogPosts.length > 5 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href="/communications-officer/blog-posts"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium flex items-center"
                  >
                    View all blog posts <FiArrowUpRight className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Create Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:col-span-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Announcement Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FiPlus className="mr-2" />
                    Create Announcement
                  </h2>
                </div>
                <div className="p-4">
                  <form
                    onSubmit={handleCreateAnnouncement}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="announcementTitle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="announcementTitle"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={newAnnouncementTitle}
                        onChange={(e) =>
                          setNewAnnouncementTitle(e.target.value)
                        }
                        required
                        placeholder="Enter announcement title..."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="announcementContent"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Content
                      </label>
                      <textarea
                        id="announcementContent"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
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
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        id="announcementTags"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={newAnnouncementTags}
                        onChange={(e) => setNewAnnouncementTags(e.target.value)}
                        placeholder="e.g. event, worship, prayer"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sendToAll"
                        type="checkbox"
                        checked={sendToAll}
                        onChange={(e) => setSendToAll(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="sendToAll"
                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                      >
                        Send to all members
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
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
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden h-full flex flex-col"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-center flex-1 flex flex-col justify-center">
                    <div className="flex flex-col items-center">
                      <FiPlus className="text-white text-2xl mb-3" />
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Create Blog Post
                      </h2>
                      <p className="text-white text-opacity-90">
                        Use our rich text editor to create engaging content
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsOfficerDashboard;
