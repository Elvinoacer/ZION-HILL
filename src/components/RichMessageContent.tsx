import React from 'react';

interface RichMessageContentProps {
  content: string;
}

const RichMessageContent: React.FC<RichMessageContentProps> = ({ content }) => {
  const renderContent = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^\s&]+)/;
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/([^\s&]+)/;

    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const youtubeMatch = part.match(youtubeRegex);
        const vimeoMatch = part.match(vimeoRegex);
        const isImage = part.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i);
        const isVideoFile = part.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
        const isPdf = part.match(/\.(pdf)(\?.*)?$/i);

        let mediaPreview = null;

        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          mediaPreview = (
            <iframe
              key={`youtube-${index}`}
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
              className="rounded-md mb-1"
            ></iframe>
          );
        } else if (vimeoMatch) {
          const videoId = vimeoMatch[1];
          mediaPreview = (
            <iframe
              key={`vimeo-${index}`}
              width="100%"
              height="315"
              src={`https://player.vimeo.com/video/${videoId}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo video player"
              className="rounded-md mb-1"
            ></iframe>
          );
        } else if (isImage) {
          mediaPreview = (
            <img key={`image-${index}`} src={part} alt="Preview" className="max-w-xs rounded-md mb-1" />
          );
        } else if (isVideoFile) {
          mediaPreview = (
            <video key={`video-${index}`} controls src={part} className="max-w-xs rounded-md mb-1" />
          );
        } else if (isPdf) {
          mediaPreview = (
            <div key={`pdf-${index}`} className="flex items-center space-x-2 p-2 border rounded-md mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>PDF Document</span>
            </div>
          );
        } else {
          mediaPreview = (
            <div key={`doc-${index}`} className="flex items-center space-x-2 p-2 border rounded-md mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Document</span>
            </div>
          );
        }

        return (
          <div key={index} className="flex flex-col space-y-1">
            {mediaPreview}
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              {part}
            </a>
          </div>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return <>{renderContent()}</>;
};

export default RichMessageContent;
