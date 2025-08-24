import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Video, VideoOff, AlertTriangle, PlayCircle, Wifi, WifiOff } from "lucide-react";
import ReactPlayer from "react-player";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
    >
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isStreaming ? <Wifi className="text-green-500"/> : <WifiOff className="text-red-500"/>}
              Live Stream Player
            </CardTitle>
            <CardDescription>
              The player below shows the current live stream. Use the controls to start, stop, or change the stream URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="player-wrapper rounded-lg overflow-hidden bg-black relative"
              style={{ 
                paddingTop: mediaType === 'audio' ? '120px' : '56.25%',
              }}
            >
              {isStreaming ? (
                renderEmbed()
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black">
                  <VideoOff size={48} className="text-gray-500"/>
                  <p className="mt-4 text-lg font-semibold">Stream is Offline</p>
                  <p className="text-sm text-gray-400">Enter a URL and start the stream to begin.</p>
                </div>
              )}
              {isStreaming && !isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Button onClick={() => setIsPlaying(true)} size="lg" variant="outline">
                    <PlayCircle className="h-8 w-8 mr-2" />
                    Play Preview
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Stream Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isStreaming && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Stream URL</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Enter video/stream URL"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleSetUrl} className="flex-shrink-0">
                    Set URL
                  </Button>
                </div>
              </div>
            )}

            {streamUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Detected Platform</p>
                <Badge variant={platform === 'Unknown' ? 'destructive' : 'secondary'}>
                  {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} from {platform}
                </Badge>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {!isStreaming ? (
              <Button
                onClick={handleStartStream}
                disabled={loading || !streamUrl}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? "Starting..." : "Start Stream"}
              </Button>
            ) : (
              <Button
                onClick={handleStopStream}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? "Stopping..." : "Stop Stream"}
              </Button>
            )}
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isStreaming ? 1 : 0 }}
                className={`w-full p-3 rounded-lg ${
                  isStreaming
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "hidden"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-semibold text-sm">Playback is active</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Current Viewers: {viewerCount}</p>
              </motion.div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default StreamManagement;