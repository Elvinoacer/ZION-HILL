import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Video, VideoOff, AlertTriangle, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";

const StreamManagement = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [platform, setPlatform] = useState("Unknown");
  const [mediaType, setMediaType] = useState("unknown"); // 'video', 'audio', 'stream'
  const [error, setError] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch("/api/livestream");
        const data = await response.json();
        if (data) {
          setIsStreaming(data.isLive);
          setStreamUrl(data.streamUrl);
          setInputUrl(data.streamUrl);
          setViewerCount(data.viewerCount);
          if (data.streamUrl) {
            const { platform, type } = detectUrlInfo(data.streamUrl);
            setPlatform(platform);
            setMediaType(type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stream data:", error);
      }
    };

    fetchStreamData();
  }, []);

  const extractYouTubeId = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const extractTwitchChannel = (url) => {
    const match = url.match(/twitch\.tv\/([^?\/]+)/);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const extractTikTokId = (url) => {
    const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const extractInstagramId = (url) => {
    const match = url.match(/instagram\.com\/(p|reel)\/([^\/?]+)/);
    return match ? url : null; // Use full URL for permalink
  };

  const extractTwitterId = (url) => {
    const match = url.match(/status\/(\d+)/);
    return match ? url : null; // Use full URL
  };

  const detectUrlInfo = (url) => {
    let detectedPlatform = "Unknown";
    let detectedType = "unknown";

    if (/youtube\.com|youtu\.be/.test(url)) {
      detectedPlatform = "YouTube";
      detectedType = url.includes("/live/") ? "stream" : "video";
    } else if (/facebook\.com|fb\.com/.test(url)) {
      detectedPlatform = "Facebook";
      detectedType = "video";
    } else if (/twitch\.tv/.test(url)) {
      detectedPlatform = "Twitch";
      detectedType = "stream";
    } else if (/soundcloud\.com/.test(url)) {
      detectedPlatform = "SoundCloud";
      detectedType = "audio";
    } else if (/vimeo\.com/.test(url)) {
      detectedPlatform = "Vimeo";
      detectedType = "video";
    } else if (/instagram\.com/.test(url)) {
      detectedPlatform = "Instagram";
      detectedType = "video";
    } else if (/tiktok\.com/.test(url)) {
      detectedPlatform = "TikTok";
      detectedType = "video";
    } else if (/twitter\.com|x\.com/.test(url)) {
      detectedPlatform = "X (Twitter)";
      detectedType = "video";
    } else if (/\.(mp4|webm|ogg|mov)$/.test(url)) {
      detectedPlatform = "Direct Video";
      detectedType = "video";
    } else if (/\.(mp3|wav|ogg|aac)$/.test(url)) {
      detectedPlatform = "Direct Audio";
      detectedType = "audio";
    } else if (url.includes(".m3u8")) {
      detectedPlatform = "HLS Stream";
      detectedType = "stream";
    } else if (url.includes(".mpd")) {
      detectedPlatform = "DASH Stream";
      detectedType = "stream";
    }

    return { platform: detectedPlatform, type: detectedType };
  };

  const handleSetUrl = () => {
    const { platform, type } = detectUrlInfo(inputUrl);
    if (platform === "Unknown") {
      setError("Unsupported URL or platform.");
      return;
    }
    setPlatform(platform);
    setMediaType(type);
    setStreamUrl(inputUrl);
    setError(null);
  };

  const handleStartStream = async () => {
    if (!streamUrl) return;
    setLoading(true);
    try {
      const { platform, type } = detectUrlInfo(streamUrl);
      await fetch("/api/livestream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamUrl, isLive: true, platform, mediaType: type }),
      });
      setIsStreaming(true);
    } catch (error) {
      setError("Failed to start stream.");
    } finally {
      setLoading(false);
    }
  };

  const handleStopStream = async () => {
    setLoading(true);
    try {
      await fetch("/api/livestream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isLive: false, streamUrl: "", viewerCount: 0 }),
      });
      setIsStreaming(false);
      setError(null);
    } catch (error) {
      setError("Failed to stop stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStreaming) return;

    let script;
    if (platform === "Instagram") {
      script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else if (platform === "TikTok") {
      script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      document.body.appendChild(script);
    } else if (platform === "X (Twitter)") {
      script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      document.body.appendChild(script);
    }

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, [isStreaming, platform]);

  const renderEmbed = () => {
    const style = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    };
    const autoplay = isPlaying ? '1' : '0';

    switch (platform) {
      case "YouTube":
        const ytId = extractYouTubeId(streamUrl);
        if (!ytId) return <p>Invalid YouTube URL</p>;
        return (
          <iframe
            style={style}
            src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoplay}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        );
      case "Facebook":
        return (
          <iframe
            style={style}
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              streamUrl
            )}&show_text=0&autoplay=${autoplay}`}
            scrolling="no"
            frameBorder="0"
            allowTransparency="true"
            allowFullScreen
          />
        );
      case "Twitch":
        const channel = extractTwitchChannel(streamUrl);
        if (!channel) return <p>Invalid Twitch URL</p>;
        return (
          <iframe
            style={style}
            src={`https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=${autoplay === '1'}`}
            frameBorder="0"
            allowFullScreen
            scrolling="no"
          />
        );
      case "SoundCloud":
        return (
          <iframe
            style={style}
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              streamUrl
            )}&auto_play=${autoplay === '1'}`}
          />
        );
      case "Vimeo":
        const vimeoId = extractVimeoId(streamUrl);
        if (!vimeoId) return <p>Invalid Vimeo URL</p>;
        return (
          <iframe
            style={style}
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay}`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        );
      case "Instagram":
        const igUrl = extractInstagramId(streamUrl);
        if (!igUrl) return <p>Invalid Instagram URL</p>;
        return (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={igUrl}
            data-instgrm-version="14"
            style={{ maxWidth: "540px", width: "100%", margin: "0 auto" }}
          />
        );
      case "TikTok":
        const ttId = extractTikTokId(streamUrl);
        if (!ttId) return <p>Invalid TikTok URL</p>;
        return (
          <blockquote
            className="tiktok-embed"
            cite={streamUrl}
            data-video-id={ttId}
            style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
          >
            <section></section>
          </blockquote>
        );
      case "X (Twitter)":
        const twUrl = extractTwitterId(streamUrl);
        if (!twUrl) return <p>Invalid X/Twitter URL</p>;
        return (
          <blockquote
            className="twitter-tweet"
            style={{ maxWidth: "550px", margin: "0 auto" }}
          >
            <a href={twUrl}></a>
          </blockquote>
        );
      default:
        return (
          <ReactPlayer
            ref={playerRef}
            className="react-player"
            url={streamUrl}
            width="100%"
            height="100%"
            style={style}
            playing={isPlaying}
            controls
            onError={(e) => {
              console.error("Playback error:", e);
              setError("Failed to play. Check URL or platform support.");
            }}
          />
        );
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
        <span>Media Player Control</span>
      </h4>

      {!isStreaming && (
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter any video/audio/stream URL (e.g., YouTube, Instagram, HLS)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSetUrl} className="w-full">
            Set URL
          </Button>
        </div>
      )}

      {streamUrl && (
        <p className="text-sm text-gray-600">
          Detected: {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}{" "}
          from {platform}
        </p>
      )}

      {isStreaming && (
        <div
          className="player-wrapper"
          style={{
            position: "relative",
            paddingTop: mediaType === "audio" ? "50px" : "56.25%",
            overflow: "hidden",
          }}
        >
          {renderEmbed()}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Button onClick={() => setIsPlaying(true)} size="lg">
                <PlayCircle className="h-8 w-8 mr-2" />
                Play Preview
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center space-x-2"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {!isStreaming ? (
          <Button
            onClick={handleStartStream}
            disabled={loading || !streamUrl}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            {loading ? "Starting..." : "Start Playback"}
          </Button>
        ) : (
          <Button
            onClick={handleStopStream}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? "Stopping..." : "Stop Playback"}
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
          <span>Playback is active</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">Current Viewers: {viewerCount}</p>
      </motion.div>
    </motion.div>
  );
};

export default StreamManagement;