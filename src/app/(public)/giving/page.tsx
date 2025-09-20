
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Gift, Users, TrendingUp } from "lucide-react";

const givingOptions = [
  {
    id: "clerk-tithes",
    name: "Tithes",
    description: "Honor God with the first fruits of your labor.",
    imageUrl: "/images/tithes-offerings.png",
  },
  {
    id: "clerk-project-support",
    name: "Project/Support",
    description: "Help us build and expand our community outreach.",
    imageUrl: "/images/project-support.png",
  },
  {
    id: "clerk-special-offerings",
    name: "Special Offerings",
    description: "Contribute to specific causes and events.",
    imageUrl: "/images/sepecial-offerings.png",
  },
];

const testimonials = [
  {
    quote: "This church has been a beacon of hope for my family. The community support is incredible.",
    name: "Jane Doe",
    imageUrl: "/gallery/church-members3.jpg",
  },
  {
    quote: "I am so grateful for the youth programs. My children have grown so much in their faith.",
    name: "John Smith",
    imageUrl: "/gallery/kids-members.jpg",
  },
];

export default function GivingPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[70vh] min-h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url(https://media.istockphoto.com/id/185539853/photo/sunset-over-a-wheat-field.jpg?s=612x612&w=0&k=20&c=5DH-4K7IBPEtXrODSwwmWr9ix7vpEix3ra-l9S_GcU0=)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center text-white text-center p-4 sm:p-6">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Partner in Generosity
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 max-w-lg sm:max-w-2xl text-base sm:text-lg md:text-xl"
          >
            Your gift empowers us to spread hope and change lives within our community and beyond.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 sm:mt-10"
          >
            <Link
              href="/login?callbackUrl=/member/giving"
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg hover:scale-105 transform transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Give Now
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Bible Verse Section */}
      <div className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
          >
            “Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”
          </motion.blockquote>
          <p className="mt-4 text-base sm:text-lg font-semibold text-gray-500 dark:text-gray-400">2 Corinthians 9:7</p>
        </div>
      </div>

      {/* Ways to Give Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">Choose Where to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {givingOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={option.imageUrl}
                    alt={option.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{option.description}</p>
                  <Link href={`/login?callbackUrl=/member/giving?fund=${option.id}`} className="inline-block mt-4 text-blue-500 font-semibold hover:text-blue-600">Give to {option.name} &rarr;</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Story Section */}
      <div className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <Image
              src="https://www.dut.ac.za/wp-content/uploads/2017/05/Nobuhle-Gideon-Aruna2.jpg"
              alt="Community Outreach"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl w-full"
            />
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Gift in Action</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
              Last year, your generosity helped us provide over 10,000 meals to families in need, offer free counseling services to 200+ individuals, and send 50 young people to a life-changing summer camp.
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Every dollar you give is a seed planted in fertile ground, yielding a harvest of hope and transformation.
            </p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4 text-base sm:text-lg font-semibold">
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
              <p>Join us in making an even greater impact this year.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">Voices of Gratitude</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-blue-200 dark:border-blue-800">
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <blockquote className="text-base sm:text-lg italic text-gray-600 dark:text-gray-300 mb-4">“{testimonial.quote}”</blockquote>
                <p className="font-bold text-gray-800 dark:text-white">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="bg-blue-600 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Your contribution, no matter the size, is a vital part of our shared mission. Let&apos;s build a better world together.
          </p>
          <Link
            href="/login?callbackUrl=/member/giving"
            className="rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-blue-600 shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
          >
            Give Securely Today
          </Link>
        </div>
      </div>
    </div>
  );
}
