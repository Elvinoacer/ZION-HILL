"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Users, Coffee, Handshake } from 'lucide-react';

const CommunityPage = () => {
  const outreachPrograms = [
    {
      name: "Community Food Pantry",
      description: "Providing essential groceries to families in need every first and third Saturday of the month.",
      imageUrl: "/images/community-food.png",
    },
    {
      name: "Prison & Hospital Visits",
      description: "Sharing hope and prayer with those who are incarcerated or unwell, bringing light to difficult places.",
      imageUrl: "/images/community-prayer.png",
    },
    {
      name: "Annual Charity Drive",
      description: "Collecting clothes, toys, and school supplies to support local shelters and schools.",
      imageUrl: "/images/youth-camp.png",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section 
        className="relative text-white parallax-bg min-h-[50vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-70"></div>
        <div className="container mx-auto px-6 py-32 relative z-10 text-center">
          <Heart className="w-20 h-20 mx-auto mb-4 text-pink-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
            Find Your Community
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Life is better together. Discover the many ways to connect and build relationships at K.A.G.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-20">
        {/* Small Groups Section */}
        <section className="mb-20 text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-700/30">
          <Users className="w-16 h-16 mx-auto mb-4 text-pink-400" />
          <h2 className="text-3xl font-bold mb-4 text-pink-400">Connect in Small Groups</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Our small groups are the heart of our community. They are places to build friendships, study the Word, and support one another through life's joys and challenges. We have groups for all ages and life stages.
          </p>
          <Link href="/ministries" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300 hover-wild shadow-lg">
            Explore Our Ministries
          </Link>
        </section>

        {/* Outreach Programs Section */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">Serving Our Neighbors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {outreachPrograms.map((program, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover-wild transition duration-300 border border-gray-700/30">
                <div className="h-56 relative">
                  <Image 
                    src={program.imageUrl} 
                    alt={program.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                  <p className="text-gray-400">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fellowship Events */}
        <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <Coffee className="w-16 h-16 mb-4 text-pink-400 inline-block" />
                    <h2 className="text-3xl font-bold mb-4 text-pink-400">Fellowship & Fun</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        From our monthly potlucks to annual picnics and holiday celebrations, there are always opportunities to connect with the church family in a relaxed and fun environment. Check our events calendar for the next gathering!
                    </p>
                    <Link href="/events" className="mt-6 inline-block text-pink-400 hover:text-purple-400 text-lg font-medium">
                        View Upcoming Events →
                    </Link>
                </div>
                <div className="h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/images/church-image.png" alt="Church fellowship" layout="fill" objectFit="cover" />
                </div>
            </div>
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
            <Handshake className="w-16 h-16 mx-auto mb-4 text-pink-400" />
            <h2 className="text-2xl font-bold mb-4">Ready to Get Involved?</h2>
            <p className="text-lg text-gray-300 mb-8">There's a place for you here. Volunteer for a program or join a small group today.</p>
            <Link href="/contact" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300 hover-wild shadow-lg">
                Contact Us
            </Link>
        </section>
      </main>
    </div>
  );
};

export default CommunityPage;
