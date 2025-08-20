import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPosting(true);
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAnnouncementTitle,
          content: newAnnouncement,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create announcement");
      }

      setNewAnnouncement("");
      setNewAnnouncementTitle("");
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.form
        onSubmit={handleAddAnnouncement}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
      >
        <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          <span>New Announcement</span>
        </h4>
        <Input
          type="text"
          placeholder="Announcement Title"
          value={newAnnouncementTitle}
          onChange={(e) => setNewAnnouncementTitle(e.target.value)}
          required
          className="mb-4"
        />
        <Textarea
          placeholder="Share updates with your team..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          required
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          disabled={posting}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          {posting ? "Posting..." : "Post Announcement"}
        </Button>
      </motion.form>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-lg text-gray-700">
          Recent Announcements
        </h4>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : announcements.length > 0 ? (
          <ul className="space-y-4">
            <AnimatePresence>
              {announcements.map((announcement) => (
                <motion.li
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    borderColor: "rgba(249, 168, 37, 0.3)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-amber-100 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 shadow-inner flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-gray-800">
                          {announcement.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <p className="mt-3 text-gray-600 whitespace-pre-line leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-gray-500">
            No announcements yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnnouncementBoard;
