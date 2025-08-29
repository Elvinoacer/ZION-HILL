"use client";

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Users, Calendar, Clock } from 'lucide-react';

const BibleStudyPage = () => {
  const studies = [
    {
      title: "Men's Thursday Morning Study",
      leader: "John Doe",
      schedule: "Thursdays at 6:30 AM",
      location: "Fellowship Hall",
      description: "A deep dive into the book of Romans, focusing on faith, grace, and righteousness.",
      icon: <Users className="w-8 h-8 text-white" />
    },
    {
      title: "Women's Weekly Connect",
      leader: "Jane Smith",
      schedule: "Wednesdays at 7:00 PM",
      location: "Online via Zoom",
      description: "Exploring the lives of influential women in the Bible and the lessons they offer for today.",
      icon: <Users className="w-8 h-8 text-white" />
    },
    {
      title: "Youth Group: The Foundation",
      leader: "Alex Johnson",
      schedule: "Fridays at 6:00 PM",
      location: "Youth Center",
      description: "Building a strong foundation in faith with relevant topics, fun activities, and open discussions for teens.",
      icon: <Users className="w-8 h-8 text-white" />
    },
    {
      title: "Couples & Conversation",
      leader: "The Millers",
      schedule: "Bi-weekly on Sundays at 5:00 PM",
      location: "Rotating Homes",
      description: "Strengthening marriages and relationships through biblical principles and shared experiences.",
      icon: <Users className="w-8 h-8 text-white" />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section 
        className="relative text-white parallax-bg min-h-[50vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/images/community-prayer.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-70"></div>
        <div className="container mx-auto px-6 py-32 relative z-10 text-center">
          <BookOpen className="w-20 h-20 mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Deepen Your Faith
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Join one of our Bible study groups to grow in your understanding of God's Word.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-20">
        {/* Current Series Section */}
        <section className="mb-20 text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-700/30">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">Current Study Series</h2>
          <h3 className="text-2xl font-semibold mb-2">The Book of James: Faith in Action</h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            This semester, we are exploring the powerful and practical wisdom in the book of James. Discover how to live out your faith in tangible ways, overcome trials, and develop true spiritual maturity. All groups will be following this theme.
          </p>
        </section>

        {/* Study Groups Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Find a Group</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {studies.map((study, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover-wild transition duration-300 border border-gray-700/30 flex flex-col">
                <div className="flex-grow">
                  <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {study.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{study.title}</h3>
                  <p className="text-gray-400 mb-4">{study.description}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-300 space-y-2 mt-4">
                    <p className="flex items-center"><Users className="w-4 h-4 mr-2 text-blue-400" /> <strong>Leader:</strong> {study.leader}</p>
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-400" /> <strong>Schedule:</strong> {study.schedule}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-400" /> <strong>Location:</strong> {study.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-lg text-gray-300 mb-8">Contact us for more information or to sign up for a group.</p>
            <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300 hover-wild shadow-lg">
                Get in Touch
            </Link>
        </section>
      </main>
    </div>
  );
};

export default BibleStudyPage;
