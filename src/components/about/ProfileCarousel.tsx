"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfileCarouselProps {
  images: string[];
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg mt-4">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt="Profile Image"
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          exit={{ rotateY: -90 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default ProfileCarousel;
