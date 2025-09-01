import React, { useState, useEffect } from "react";

interface RichMessageContentProps {
  content: string;
}

const RichMessageContent: React.FC<RichMessageContentProps> = ({ content }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderContent = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^\s&]+)/;
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/([^\s&]+)/;

    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const youtubeMatch = part.match(youtubeRegex);
        const vimeoMatch = part.match(vimeoRegex);
        const isImage = part.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i);
        const isVideoFile = part.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
        const isPdf = part.match(/\.(pdf)(\?.*)?$/i);
        const isDocument = part.match(
          /\.(doc|docx|xls|xlsx|ppt|pptx|txt)(\?.*)?$/i
        );

        let mediaPreview = null;

        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          mediaPreview = (
            <div
              key={`youtube-${index}`}
              className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden my-2 shadow-md"
            >
              {isMounted && (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                />
              )}
            </div>
          );
        } else if (vimeoMatch) {
          const videoId = vimeoMatch[1];
          mediaPreview = (
            <div
              key={`vimeo-${index}`}
              className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden my-2 shadow-md"
            >
              {isMounted && (
                <iframe
                  src={`https://player.vimeo.com/video/${videoId}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vimeo video player"
                />
              )}
            </div>
          );
        } else if (isImage) {
          mediaPreview = (
            <div key={`image-${index}`} className="my-2 flex justify-center">
              <img
                src={part}
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg cursor-pointer shadow-sm"
                onClick={() => window.open(part, "_blank")}
                loading="lazy"
              />
            </div>
          );
        } else if (isVideoFile) {
          mediaPreview = (
            <div key={`video-${index}`} className="my-2">
              <video
                controls
                src={part}
                className="max-w-full max-h-64 rounded-lg shadow-sm"
              />
            </div>
          );
        } else if (isPdf) {
          mediaPreview = (
            <a
              key={`pdf-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg my-2 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm truncate">PDF Document</span>
            </a>
          );
        } else if (isDocument) {
          const extension = part.split(".").pop()?.toUpperCase();
          mediaPreview = (
            <a
              key={`doc-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg my-2 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm truncate">{extension} Document</span>
            </a>
          );
        } else {
          mediaPreview = (
            <a
              key={`link-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg my-2 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span className="text-sm truncate">{part}</span>
            </a>
          );
        }

        return (
          <div key={index} className="break-words">
            {mediaPreview}
          </div>
        );
      } else {
        return (
          <span key={index} className="break-words">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <div className="rich-message-content leading-relaxed text-sm">
      {renderContent()}
    </div>
  );
};

export default RichMessageContent;
