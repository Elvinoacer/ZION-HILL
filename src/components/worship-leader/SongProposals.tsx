import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface SongProposal {
  id: string;
  title: string;
  artist: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  likes: number;
  createdAt: string;
  hasLiked?: boolean; // New property to indicate if the current user has liked it
  likesByUsers?: { userId: string }[]; // Add this line
}

const SongProposals = () => {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<SongProposal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const res = await fetch("/api/song-proposals");
      if (!res.ok) throw new Error("Failed to fetch song proposals");
      const data: SongProposal[] = await res.json();

      // Determine if the current user has liked each proposal
      const proposalsWithLikeStatus = data.map((proposal) => ({
        ...proposal,
        hasLiked: proposal.likesByUsers?.some(
          (like) => like.userId === session?.user?.id
        ),
      }));

      setProposals(proposalsWithLikeStatus);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleLike = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/song-proposals/like?id=${proposalId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to like proposal");
      }
      fetchProposals();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100"
      >
        <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
          <Music className="h-5 w-5 text-pink-600" />
          <span>Song Proposals</span>
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          Team members can suggest songs for upcoming services
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-200"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : proposals.length > 0 ? (
        <ul className="space-y-4">
          <AnimatePresence>
            {proposals.map((proposal) => (
              <motion.li
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-lg bg-white shadow-xs border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                    <Music className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-700">
                        {proposal.user.name}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(proposal.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">
                      <span className="font-semibold">{proposal.title}</span> by{" "}
                      {proposal.artist}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(proposal.id)}
                        className={`flex items-center space-x-1 ${proposal.hasLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"}`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${proposal.hasLiked ? "fill-pink-500" : ""}`} />
                        <span>{proposal.likes}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-gray-50 text-center text-gray-500"
        >
          No song proposals yet
        </motion.div>
      )}
    </div>
  );
};

export default SongProposals;
