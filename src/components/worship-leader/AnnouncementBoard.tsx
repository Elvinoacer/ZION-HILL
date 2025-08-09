import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, User } from "lucide-react";

interface Announcement {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
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
        body: JSON.stringify({ content: newAnnouncement }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create announcement");
      }

      setNewAnnouncement("");
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
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-lg bg-white shadow-xs border border-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-700">
                          {announcement.user.name}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600 whitespace-pre-line">
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
