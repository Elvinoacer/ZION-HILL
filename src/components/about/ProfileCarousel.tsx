"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfileCarouselProps {
  images: string[];
  isMobile?: boolean;
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({
  images,
  isMobile,
}) => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (newIndex: number) => {
    setIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setAutoPlay(false); // Pause autoplay during interaction
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextImage();
    } else if (touchEnd - touchStart > 50) {
      // Swipe right
      prevImage();
    }
    // Resume autoplay after a delay
    setTimeout(() => setAutoPlay(true), 5000);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-32 overflow-hidden rounded-lg mt-3 bg-gray-200 flex items-center justify-center sm:h-40 md:h-48">
        <span className="text-gray-500 text-sm">No images available</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full h-32 overflow-hidden rounded-lg mt-3 sm:h-40 md:h-48">
        <img
          src={images[0]}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-32 overflow-hidden rounded-lg mt-3 sm:h-40 md:h-48"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt="Profile Image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {/* Navigation buttons - hidden on mobile, shown on larger screens */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-1 -translate-y-1/2 bg-black/40 p-1 rounded-full hidden sm:flex md:left-2"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-3 w-3 text-white md:h-4 md:w-4" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-1 -translate-y-1/2 bg-black/40 p-1 rounded-full hidden sm:flex md:right-2"
        aria-label="Next image"
      >
        <ChevronRight className="h-3 w-3 text-white md:h-4 md:w-4" />
      </button>

      {/* Indicators - always visible but smaller on mobile */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToImage(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/50"
            } ${isMobile ? "" : "hover:bg-white/80"}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileCarousel;
