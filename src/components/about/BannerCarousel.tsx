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

const BannerCarousel = () => {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full h-96 overflow-hidden rounded-2xl shadow-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Church Banner"
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt="Church Banner"
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          exit={{ rotateY: -90 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-6 h-1/2">
        <h1
          className="text-4xl md:text-6xl font-bold bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-green-500 text-glow"
        >
          Welcome to {churchConfig.name}
        </h1>
        <p
          className="text-lg md:text-xl bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-8 text-glow-p"
        >
          A place to grow in faith and community.
        </p>
        <a href="/signup">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
            Become a Member
          </button>
        </a>
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6 text-black" />
      </button>
    </div>
  );
};

export default BannerCarousel;
