import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Video, VideoOff } from "lucide-react";
import ReactPlayer from "react-player";

const StreamManagement = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const handleStartStream = async () => {
    try {
      setLoading(true);
      // In a real application, you would get the stream URL from your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsStreaming(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStopStream = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsStreaming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-100"
    >
      <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
        {isStreaming ? (
          <Video className="h-5 w-5 text-red-600" />
        ) : (
          <VideoOff className="h-5 w-5 text-gray-600" />
        )}
        <span>Live Stream Control</span>
      </h4>

      {!isStreaming && (
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter stream URL (e.g., HLS or DASH)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full"
          />
          <Button onClick={() => setStreamUrl(inputUrl)} className="w-full">
            Set Stream URL
          </Button>
        </div>
      )}

      {isStreaming && (
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={streamUrl}
            width="100%"
            height="100%"
            playing
            controls
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {!isStreaming ? (
          <Button
            onClick={handleStartStream}
            disabled={loading || !streamUrl}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            {loading ? "Starting..." : "Start Stream"}
          </Button>
        ) : (
          <Button
            onClick={handleStopStream}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? "Stopping..." : "Stop Stream"}
          </Button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isStreaming ? 1 : 0 }}
        className={`p-3 rounded-lg ${
          isStreaming
            ? "bg-green-50 text-green-600 border border-green-200"
            : "hidden"
        }`}
      >
        <p className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Stream is live</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StreamManagement;
