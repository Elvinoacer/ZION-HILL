"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { safeFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Music,
  Mic2,
  ListMusic,
  Disc,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SongProposal {
  id: string;
  title: string;
  artist: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  userId: string;
  user: { name: string; image?: string };
  createdAt: string;
}

interface SongSearchResult {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackViewUrl?: string;
}

const MusicProposalsPage = () => {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<SongProposal[]>([]);
  const [newProposal, setNewProposal] = useState({
    title: "",
    artist: "",
    youtubeUrl: "",
    spotifyUrl: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SongSearchResult[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "proposals" | "guidelines" | "top"
  >("proposals");
  const [formProgress, setFormProgress] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const fetchProposals = async () => {
    try {
      setLoadingProposals(true);
      const data = await safeFetch<SongProposal[]>("/api/music-proposals");
      setProposals(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setLoadingProposals(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setLoadingSearch(true);
        try {
          const data = await safeFetch<SongSearchResult[]>(
            `/api/song-search?term=${encodeURIComponent(searchTerm)}`
          );
          setSearchResults(data);
        } catch (err: any) {
          setError(err.message);
          setSearchResults([]);
          toast.error(err.message, {
            icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          });
        } finally {
          setLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const audio = document.getElementById("audio-preview") as HTMLAudioElement;
    if (audio) {
      if (playingPreviewUrl) {
        audio.play().catch((e) => console.error("Error playing audio:", e));
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [playingPreviewUrl]);

  useEffect(() => {
    const fields = ["title", "artist", "youtubeUrl", "spotifyUrl"];
    const filledFields = fields.filter(
      (field) => newProposal[field as keyof typeof newProposal]
    ).length;
    const progress = Math.round((filledFields / fields.length) * 100);
    setFormProgress(progress);
  }, [newProposal]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be logged in to submit a proposal.");
      toast.error("Please log in to submit a proposal.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }
    if (!newProposal.title || !newProposal.artist) {
      setError("Song title and artist are required.");
      toast.error("Song title and artist are required.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    setSubmittingProposal(true);
    setError(null);

    try {
      await safeFetch("/api/music-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProposal,
          userId: session.user.id,
        }),
      });
      setNewProposal({ title: "", artist: "", youtubeUrl: "", spotifyUrl: "" });
      setSearchResults([]);
      setShowConfirmationModal(true);
      fetchProposals();
      toast.success("Proposal submitted successfully!", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleSearchResultSelect = (result: SongSearchResult) => {
    setNewProposal({
      ...newProposal,
      title: result.trackName,
      artist: result.artistName,
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  if (loadingProposals) {
    return <LoadingState />;
  }

  if (error && !loadingSearch) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Music Proposals
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600"
          >
            Suggest songs for our worship services or church events!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-indigo-700">
                  <Music className="w-5 h-5" />
                  Submit a New Proposal
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Search for a song or manually enter details.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for a song (e.g., 'Amazing Grace Chris Tomlin')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>

                  {loadingSearch && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center items-center py-4"
                    >
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                      >
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          >
                            <div
                              className="flex items-center flex-grow gap-3"
                              onClick={() => handleSearchResultSelect(result)}
                            >
                              <div className="relative">
                                <img
                                  src={result.artworkUrl100}
                                  alt={result.trackName}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                {result.previewUrl && (
                                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                    {playingPreviewUrl === result.previewUrl ? (
                                      <Pause className="w-4 h-4 text-white" />
                                    ) : (
                                      <Play className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm sm:text-base truncate">
                                  {result.trackName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {result.artistName}
                                </p>
                              </div>
                            </div>
                            {result.previewUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (playingPreviewUrl === result.previewUrl) {
                                    setPlayingPreviewUrl(null);
                                  } else {
                                    setPlayingPreviewUrl(result.previewUrl);
                                  }
                                }}
                              >
                                {playingPreviewUrl === result.previewUrl ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Form Completion
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {formProgress}%
                      </span>
                    </div>
                    <Progress
                      value={formProgress}
                      className="h-1.5 bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Song Title
                      </label>
                      <Input
                        type="text"
                        placeholder="Song Title"
                        value={newProposal.title}
                        onChange={(e) =>
                          setNewProposal({
                            ...newProposal,
                            title: e.target.value,
                          })
                        }
                        required
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artist
                      </label>
                      <Input
                        type="text"
                        placeholder="Artist"
                        value={newProposal.artist}
                        onChange={(e) =>
                          setNewProposal({
                            ...newProposal,
                            artist: e.target.value,
                          })
                        }
                        required
                        className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Link (Optional)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newProposal.youtubeUrl}
                      onChange={(e) =>
                        setNewProposal({
                          ...newProposal,
                          youtubeUrl: e.target.value,
                        })
                      }
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spotify Link (Optional)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://open.spotify.com/track/..."
                      value={newProposal.spotifyUrl}
                      onChange={(e) =>
                        setNewProposal({
                          ...newProposal,
                          spotifyUrl: e.target.value,
                        })
                      }
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submittingProposal || !session?.user?.id}
                    >
                      {submittingProposal ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Proposal"
                      )}
                    </Button>
                  </motion.div>

                  {!session?.user?.id && (
                    <p className="text-center text-sm text-gray-500">
                      <Link
                        href="/login"
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Log in
                      </Link>{" "}
                      to submit proposals.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-indigo-700">
                  <ListMusic className="w-5 h-5" />
                  Submitted Proposals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {proposals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Disc className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">
                      No proposals submitted yet.
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Be the first to suggest a song!
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {proposals.map((proposal) => {
                        const youtubeVideoId = proposal.youtubeUrl
                          ? getYouTubeVideoId(proposal.youtubeUrl)
                          : null;
                        return (
                          <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              {proposal.user.image ? (
                                <img
                                  src={proposal.user.image}
                                  alt={proposal.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {proposal.user.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-sm sm:text-base">
                                    {proposal.title}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(
                                      new Date(proposal.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  by {proposal.artist}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Proposed by {proposal.user.name}
                                </p>

                                {(proposal.youtubeUrl ||
                                  proposal.spotifyUrl) && (
                                  <div className="flex gap-3 mt-3">
                                    {proposal.youtubeUrl && (
                                      <a
                                        href={proposal.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                        </svg>
                                        YouTube
                                      </a>
                                    )}
                                    {proposal.spotifyUrl && (
                                      <a
                                        href={proposal.spotifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-2c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
                                        </svg>
                                        Spotify
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {youtubeVideoId && (
                              <div className="mt-4 relative aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe
                                  className="absolute inset-0 w-full h-full"
                                  src={`https://www.youtube.com/embed/${youtubeVideoId}?modestbranding=1&rel=0`}
                                  title="YouTube video player"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg sm:text-xl text-indigo-700">
                      Proposal Guidelines
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {[
                      "Suggest songs that align with our church's values and worship style.",
                      "Ensure the song is appropriate for public worship or events.",
                      "Provide accurate title and artist information.",
                      "Optional: Include YouTube or Spotify links for reference.",
                      "Proposals will be reviewed by the worship team.",
                    ].map((guideline, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {guideline}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Disc className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg sm:text-xl text-indigo-700">
                      Top Requested Songs
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Music className="w-8 h-8 text-indigo-600" />
                      </div>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Coming soon!
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        We'll show the most popular song requests here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showConfirmationModal && (
            <Dialog
              open={showConfirmationModal}
              onOpenChange={setShowConfirmationModal}
            >
              <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span>Proposal Submitted</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    Your song proposal has been successfully submitted and will
                    be reviewed by the worship team.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => setShowConfirmationModal(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <audio
          id="audio-preview"
          src={playingPreviewUrl || ""}
          preload="auto"
        />
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-lg bg-gray-200" />
        <Skeleton className="h-6 w-80 rounded-lg bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl bg-gray-200" />
          <Skeleton className="h-[500px] w-full rounded-2xl bg-gray-200" />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl bg-gray-200" />
          <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center"
  >
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-red-800 mb-4">
        Error Loading Page
      </h3>
      <p className="text-sm text-red-600 mb-6">{error}</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.location.reload()}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md px-4 py-2 transition-transform transform"
      >
        Try Again
      </motion.button>
    </div>
  </motion.div>
);

const getYouTubeVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[\?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  return url.match(regex)?.[1] || null;
};

export default MusicProposalsPage;
