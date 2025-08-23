"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBullhorn, FaHashtag } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string; // Added content field to match rendering
  url: string;
  tags: string[];
  createdAt: string;
}

const PublicAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await res.json();
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Loading announcements...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100"
        >
          <p className="text-base sm:text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            Church Announcements
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and messages from our
            church community.
          </p>
        </motion.div>

        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center">
            <FaBullhorn className="text-white text-xl sm:text-2xl mr-3" />
            <CardTitle className="text-lg sm:text-xl font-semibold text-white">
              Latest Announcements
            </CardTitle>
            <span className="ml-auto bg-white text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {announcements.length}
            </span>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                <AnimatePresence>
                  {announcements.map((announcement) => (
                    <motion.li
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-700 text-sm sm:text-base mb-3 line-clamp-3">
                            {announcement.content}
                          </p>
                          {announcement.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {announcement.tags.map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  <FaHashtag className="mr-1" size={12} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500 mt-3">
                            Published on:{" "}
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        {announcement.url && (
                          <a
                            href={announcement.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 sm:mt-0 sm:ml-4 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                            aria-label="View full announcement"
                          >
                            <FiExternalLink
                              size={18}
                              className="sm:h-5 sm:w-5"
                            />
                          </a>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">
                  No announcements available at the moment. Please check back
                  later!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicAnnouncementsPage;
