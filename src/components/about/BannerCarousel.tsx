"use client";
import { churchConfig } from "@/lib/church-config";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/gallery/banner-fb.jpg",
  "/gallery/banner-fb2.jpg",
  "/gallery/chuch-members4.jpg",
  "/gallery/church-compound.jpg",
  "/gallery/church-member-view.jpg",
  "/gallery/church-members.jpg",
  "/gallery/church-members3.jpg",
  "/gallery/church-members5.jpg",
];

interface BannerCarouselProps {
  isMobile?: boolean;
}

const BannerCarousel = ({ isMobile }: BannerCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
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
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full h-48 overflow-hidden rounded-xl shadow-xl sm:h-64 md:h-80 lg:h-96"
      role="region"
      aria-roledescription="carousel"
      aria-label="Church Banner"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt="Church Banner"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-4 pb-6 sm:p-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-1 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Welcome to {churchConfig.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-200 mb-4 sm:text-base md:text-lg md:mb-6"
        >
          A place to grow in faith and community.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <a href="/signup">
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors sm:px-6 sm:py-2.5 sm:text-base md:px-8 md:py-3">
              Become a Member
            </button>
          </a>
        </motion.div>
      </div>

      {/* Indicators - Hidden on mobile for cleaner UI, shown on larger screens */}
      <div className="absolute bottom-4 right-4 hidden sm:flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons - Hidden on mobile, shown on larger screens */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full hidden sm:flex md:left-4 md:p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 text-black md:h-5 md:w-5" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full hidden sm:flex md:right-4 md:p-2"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 text-black md:h-5 md:w-5" />
      </button>

      {/* Mobile-only indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center sm:hidden">
        <div className="flex space-x-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
