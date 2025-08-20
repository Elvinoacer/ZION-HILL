'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, PlayCircle } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/button';

interface LiveStreamViewerProps {
  streamUrl: string;
}

const LiveStreamViewer = ({ streamUrl }: LiveStreamViewerProps) => {
  const [platform, setPlatform] = useState('Unknown');
  const [mediaType, setMediaType] = useState('unknown');
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const extractTwitchChannel = (url: string) => {
    const match = url.match(/twitch\.tv\/([^? /]+)/);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const extractTikTokId = (url: string) => {
    const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/(p|reel)\/([^\/?]+)/);
    return match ? url : null; // Use full URL for permalink
  };

  const extractTwitterId = (url: string) => {
    const match = url.match(/status\/(\d+)/);
    return match ? url : null; // Use full URL
  };

  const detectUrlInfo = (url: string) => {
    let detectedPlatform = 'Unknown';
    let detectedType = 'unknown';

    if (/youtube\.com|youtu\.be/.test(url)) {
      detectedPlatform = 'YouTube';
      detectedType = url.includes('/live/') ? 'stream' : 'video';
    } else if (/facebook\.com|fb\.com/.test(url)) {
      detectedPlatform = 'Facebook';
      detectedType = 'video';
    } else if (/twitch\.tv/.test(url)) {
      detectedPlatform = 'Twitch';
      detectedType = 'stream';
    } else if (/soundcloud\.com/.test(url)) {
      detectedPlatform = 'SoundCloud';
      detectedType = 'audio';
    } else if (/vimeo\.com/.test(url)) {
      detectedPlatform = 'Vimeo';
      detectedType = 'video';
    } else if (/instagram\.com/.test(url)) {
      detectedPlatform = 'Instagram';
      detectedType = 'video';
    } else if (/tiktok\.com/.test(url)) {
      detectedPlatform = 'TikTok';
      detectedType = 'video';
    } else if (/twitter\.com|x\.com/.test(url)) {
      detectedPlatform = 'X (Twitter)';
      detectedType = 'video';
    } else if (/\.(mp4|webm|ogg|mov)$/.test(url)) {
      detectedPlatform = 'Direct Video';
      detectedType = 'video';
    } else if (/\.(mp3|wav|ogg|aac)$/.test(url)) {
      detectedPlatform = 'Direct Audio';
      detectedType = 'audio';
    } else if (url.includes('.m3u8')) {
      detectedPlatform = 'HLS Stream';
      detectedType = 'stream';
    } else if (url.includes('.mpd')) {
      detectedPlatform = 'DASH Stream';
      detectedType = 'stream';
    }

    return { platform: detectedPlatform, type: detectedType };
  };

  useEffect(() => {
    if (streamUrl) {
      const { platform, type } = detectUrlInfo(streamUrl);
      setPlatform(platform);
      setMediaType(type);
    }
  }, [streamUrl]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    if (platform === 'Instagram') {
      script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      document.body.appendChild(script);
    } else if (platform === 'TikTok') {
      script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(script);
    } else if (platform === 'X (Twitter)') {
      script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      document.body.appendChild(script);
    }

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, [platform]);

  const renderEmbed = () => {
    const style = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };

    const autoplay = isPlaying ? '1' : '0';

    switch (platform) {
      case 'YouTube':
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
      case 'Facebook':
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
      case 'Twitch':
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
      case 'SoundCloud':
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
      case 'Vimeo':
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
      case 'Instagram':
        const igUrl = extractInstagramId(streamUrl);
        if (!igUrl) return <p>Invalid Instagram URL</p>;
        return (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={igUrl}
            data-instgrm-version="14"
            style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}
          />
        );
      case 'TikTok':
        const ttId = extractTikTokId(streamUrl);
        if (!ttId) return <p>Invalid TikTok URL</p>;
        return (
          <blockquote
            className="tiktok-embed"
            cite={streamUrl}
            data-video-id={ttId}
            style={{ maxWidth: '605px', minWidth: '325px', margin: '0 auto' }}
          >
            <section></section>
          </blockquote>
        );
      case 'X (Twitter)':
        const twUrl = extractTwitterId(streamUrl);
        if (!twUrl) return <p>Invalid X/Twitter URL</p>;
        return (
          <blockquote
            className="twitter-tweet"
            style={{ maxWidth: '550px', margin: '0 auto' }}
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
              console.error('Playback error:', e);
              setError('Failed to play. Check URL or platform support.');
            }}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
    >
      <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
        <Video className="h-5 w-5 text-blue-600" />
        <span>Live Stream</span>
      </h4>

      <p className="text-sm text-gray-600">Platform: {platform}</p>

      <div
        className="player-wrapper"
        style={{
          position: 'relative',
          paddingTop: mediaType === 'audio' ? '50px' : '56.25%',
          overflow: 'hidden',
        }}
      >
        {renderEmbed()}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Button onClick={() => setIsPlaying(true)} size="lg">
              <PlayCircle className="h-8 w-8 mr-2" />
              Play
            </Button>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center space-x-2"
        >
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 rounded-lg bg-green-50 text-green-600 border border-green-200"
      >
        <p className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Live</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LiveStreamViewer;
