"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBullhorn, FaHashtag } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

interface Announcement {
  id: string;
  title: string;
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            Church Announcements
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and messages from our church community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
            <FaBullhorn className="text-white text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-white">Latest Announcements</h2>
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
                    className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 last:mb-0"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-xl mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-700 mt-2 mb-3">{announcement.content}</p>
                        {announcement.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {announcement.tags.map((tag, index) => (
                              <span
                                key={`${tag}-${index}`}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                              >
                                <FaHashtag className="mr-1" size={12} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-3">
                          Published on: {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {announcement.url && (
                        <a
                          href={announcement.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label="View full announcement"
                        >
                          <FiExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No announcements available at the moment. Please check back later!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicAnnouncementsPage;
