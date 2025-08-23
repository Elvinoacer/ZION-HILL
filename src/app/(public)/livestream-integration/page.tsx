"use client";

import React, { useState, useEffect } from "react";
import LiveStreamViewer from "@/components/LiveStreamViewer";
import { Skeleton } from "@/components/ui/skeleton";

const LiveStreamPage = () => {
  const [streamData, setStreamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch("/api/livestream");
        const data = await response.json();
        setStreamData(data);
      } catch (error) {
        console.error("Failed to fetch stream data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, []);

  const handlePlay = async () => {
    // Optimistically update the UI
    setStreamData((prevData: any) => ({
      ...prevData,
      viewerCount: prevData.viewerCount + 1,
    }));

    try {
      await fetch("/api/livestream/view", { method: "POST" });
    } catch (error) {
      // Revert the UI if the request fails
      setStreamData((prevData: any) => ({
        ...prevData,
        viewerCount: prevData.viewerCount - 1,
      }));
      console.error("Failed to increment view count:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Skeleton className="h-6 w-48 sm:w-64 mb-2 bg-gray-700 animate-pulse" />
            <Skeleton className="h-3 w-24 sm:w-32 bg-gray-700 animate-pulse" />
          </div>

          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <Skeleton className="w-full h-64 sm:h-80 md:h-96 bg-gray-700 animate-pulse" />
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Skeleton className="h-16 sm:h-20 rounded-lg bg-gray-800 animate-pulse" />
            <Skeleton className="h-16 sm:h-20 rounded-lg bg-gray-800 animate-pulse" />
            <Skeleton className="h-16 sm:h-20 rounded-lg bg-gray-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!streamData || !streamData.isLive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <div className="container mx-auto max-w-xl text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/30 border-red-500/50">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse-slow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                Live Stream
              </h1>
              <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base">
                The live stream is currently offline.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 bg-gray-900/50 p-5 sm:p-6 rounded-xl border border-gray-700/30">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Next Stream Schedule
              </h2>
              <div className="flex justify-center items-center space-x-3 sm:space-x-4">
                <div className="text-center p-2 sm:p-3 bg-gray-800/50 rounded-lg min-w-[60px] sm:min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold">12</div>
                  <div className="text-xs sm:text-sm text-gray-400">Hours</div>
                </div>
                <div className="text-xl sm:text-2xl text-gray-400 font-bold">:</div>
                <div className="text-center p-2 sm:p-3 bg-gray-800/50 rounded-lg min-w-[60px] sm:min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold">45</div>
                  <div className="text-xs sm:text-sm text-gray-400">Minutes</div>
                </div>
                <div className="text-xl sm:text-2xl text-gray-400 font-bold">:</div>
                <div className="text-center p-2 sm:p-3 bg-gray-800/50 rounded-lg min-w-[60px] sm:min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-extrabold">22</div>
                  <div className="text-xs sm:text-sm text-gray-400">Seconds</div>
                </div>
              </div>

              <button className="mt-5 sm:mt-6 w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base shadow-lg hover:shadow-xl">
                Notify Me When Live
              </button>
            </div>

            <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-500">
              Follow us on social media to get updates
            </p>
            <div className="flex justify-center space-x-3 sm:space-x-4 mt-3 sm:mt-4">
              <a href="#" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700/50 hover:bg-blue-400/20 cursor-pointer flex items-center justify-center transition-colors duration-300 group">
                <span className="text-lg sm:text-xl group-hover:text-blue-400 transition-colors duration-300">🐦</span>
              </a>
              <a href="#" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700/50 hover:bg-blue-600/20 cursor-pointer flex items-center justify-center transition-colors duration-300 group">
                <span className="text-lg sm:text-xl group-hover:text-blue-600 transition-colors duration-300">📘</span>
              </a>
              <a href="#" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700/50 hover:bg-red-500/20 cursor-pointer flex items-center justify-center transition-colors duration-300 group">
                <span className="text-lg sm:text-xl group-hover:text-red-500 transition-colors duration-300">📸</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 sm:mb-6">
          <div className="md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Live Stream
            </h1>
            <p className="text-gray-400 mt-0.5 sm:mt-1 flex items-center text-sm sm:text-base">
              <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 animate-pulse"></span>
              </span>
              <span className="ml-1.5 sm:ml-2">
                Live now • {streamData.viewerCount} viewers
              </span>
            </p>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 flex items-center hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Rewind
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 flex items-center hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Live
            </button>
          </div>
        </div>

        <div
          className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-6 group relative cursor-pointer hover:ring-2 hover:ring-red-500 hover:ring-offset-2 hover:ring-offset-gray-900 transition-all duration-300"
          onClick={handlePlay}
        >
          <LiveStreamViewer streamUrl={streamData.streamUrl} />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xl font-bold">Click to Play</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Stream Info
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400 font-medium">Live</span>
              </li>
              <li className="flex justify-between">
                <span>Duration:</span>
                <span>2:45:12</span>
              </li>
              <li className="flex justify-between">
                <span>Quality:</span>
                <span>1080p HD</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Audience
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold animate-pulse-fast">
                  {streamData.viewerCount}
                </div>
                <div className="text-sm text-gray-400">Viewers</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Up Next
            </h3>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="font-medium group-hover:text-yellow-300 transition-colors duration-300">Q&A Session</div>
                <div className="text-sm text-gray-400">
                  Starts in 25 minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;
