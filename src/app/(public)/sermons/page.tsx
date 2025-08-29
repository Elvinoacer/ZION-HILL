"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard, Mic, User, Calendar, Search } from 'lucide-react';
import { useState } from 'react';

const SermonsPage = () => {
  const allSermons = [
    {
      title: "Living a Life of Purpose",
      speaker: "Pastor John Smith",
      date: "2024-08-25",
      series: "Foundations of Faith",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      audioUrl: "#",
      imageUrl: "/images/blog-default.png"
    },
    {
      title: "The Power of Forgiveness",
      speaker: "Pastor John Smith",
      date: "2024-08-18",
      series: "Foundations of Faith",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      audioUrl: "#",
      imageUrl: "/images/hero.png"
    },
    {
      title: "Navigating Life's Storms",
      speaker: "Guest Speaker: Dr. Emily White",
      date: "2024-08-11",
      series: "Summer Sessions",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      audioUrl: "#",
      imageUrl: "/images/hero2.png"
    },
    {
      title: "The Heart of a Servant",
      speaker: "Pastor John Smith",
      date: "2024-08-04",
      series: "Foundations of Faith",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      audioUrl: "#",
      imageUrl: "/images/community-prayer.png"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const filteredSermons = allSermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredSermon = filteredSermons[0];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section 
        className="relative text-white parallax-bg min-h-[50vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/images/blog-default.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-70"></div>
        <div className="container mx-auto px-6 py-32 relative z-10 text-center">
          <Clapperboard className="w-20 h-20 mx-auto mb-4 text-purple-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
            Sermon Archive
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Catch up on past messages and find encouragement throughout your week.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-20">
        {/* Featured Sermon */}
        {featuredSermon && (
          <section className="mb-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/30 overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="h-64 md:h-full relative">
                <Image src={featuredSermon.imageUrl} alt={featuredSermon.title} layout="fill" objectFit="cover" />
              </div>
              <div className="p-8">
                <h2 className="text-sm font-bold text-purple-400 mb-2">FEATURED MESSAGE</h2>
                <h3 className="text-3xl font-bold text-white mb-3">{featuredSermon.title}</h3>
                <div className="text-gray-400 space-y-2 mb-6">
                  <p className="flex items-center"><User className="w-4 h-4 mr-2" /> {featuredSermon.speaker}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(featuredSermon.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-4">
                  <Link href={featuredSermon.youtubeUrl} target="_blank" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 hover-wild shadow-lg flex items-center">
                    <Clapperboard className="w-5 h-5 mr-2" /> Watch Now
                  </Link>
                  <Link href={featuredSermon.audioUrl} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 hover-wild shadow-lg flex items-center">
                    <Mic className="w-5 h-5 mr-2" /> Listen
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <section className="mb-12">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search sermons by title or speaker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </section>

        {/* Sermon List */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover-wild transition duration-300 border border-gray-700/30 flex flex-col">
                <div className="h-48 relative">
                  <Image src={sermon.imageUrl} alt={sermon.title} layout="fill" objectFit="cover" className="hover:scale-110 transition duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{sermon.title}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p className="flex items-center"><User className="w-4 h-4 mr-2" /> {sermon.speaker}</p>
                      <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(sermon.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                     <Link href={sermon.youtubeUrl} target="_blank" className="text-sm text-purple-400 hover:text-blue-400 font-medium w-full text-center bg-gray-700/50 py-2 rounded-md hover:bg-gray-700 transition-colors">
                      Watch
                    </Link>
                    <Link href={sermon.audioUrl} className="text-sm text-purple-400 hover:text-blue-400 font-medium w-full text-center bg-gray-700/50 py-2 rounded-md hover:bg-gray-700 transition-colors">
                      Listen
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SermonsPage;
