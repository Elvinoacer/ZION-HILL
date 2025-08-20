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
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const fetchProposals = async () => {
    try {
      setLoadingProposals(true);
      const data = await safeFetch<SongProposal[]>("/api/music-proposals");
      setProposals(data);
    } catch (err: any) {
      setError(err.message);
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

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be logged in to submit a proposal.");
      return;
    }
    if (!newProposal.title || !newProposal.artist) {
      setError("Song title and artist are required.");
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
      fetchProposals();
    } catch (err: any) {
      setError(err.message);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Music Proposals
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          Suggest songs for our worship services or church events!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Music className="w-5 h-5 text-blue-500" />
                  Submit a New Proposal
                </CardTitle>
                <CardDescription>
                  Search for a song or manually enter details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for a song (e.g., 'Amazing Grace Chris Tomlin')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>

                  {loadingSearch && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center items-center py-4"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border rounded-md overflow-hidden"
                      >
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
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
                                <p className="font-medium truncate">
                                  {result.trackName}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {result.artistName}
                                </p>
                              </div>
                            </div>
                            {result.previewUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={submittingProposal || !session?.user?.id}
                    >
                      {submittingProposal ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
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
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Log in
                      </Link>{" "}
                      to submit proposals.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-blue-500" />
                  Submitted Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {proposals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Disc className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No proposals submitted yet.</p>
                    <p className="text-gray-400 text-sm mt-1">
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
                            className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              {proposal.user.image ? (
                                <img
                                  src={proposal.user.image}
                                  alt={proposal.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {proposal.user.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-lg">
                                    {proposal.title}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(
                                      new Date(proposal.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
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
                                        className="inline-flex items-center gap-1 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
                                        className="inline-flex items-center gap-1 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
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
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mic2 className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Proposal Guidelines</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          1
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Suggest songs that align with our church's values and
                      worship style.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          2
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Ensure the song is appropriate for public worship or
                      events.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          3
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Provide accurate title and artist information.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          4
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Optional: Include YouTube or Spotify links for reference.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          5
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Proposals will be reviewed by the worship team.
                    </span>
                  </motion.li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Disc className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Top Requested Songs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Music className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-gray-500">Coming soon!</p>
                    <p className="text-gray-400 text-sm mt-1">
                      We'll show the most popular song requests here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <audio id="audio-preview" src={playingPreviewUrl || ""} preload="auto" />
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
  >
    <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-lg shadow">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-500">
            Error loading page
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="inline-flex items-center text-sm font-medium text-red-700 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400"
            >
              Try again
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const getYouTubeVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[\?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  return url.match(regex)?.[1] || null;
};

export default MusicProposalsPage;
