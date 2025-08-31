"use client";
import { churchConfig } from "@/lib/church-config";

import { safeFetch } from "@/lib/api";
import Head from "next/head"; // Keep Head for meta tags
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// --- Interfaces for fetched data ---
interface Theme {
  id: string;
  title: string;
  verse: string;
  reference: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
}

// --- Reusable Components ---
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-3xl md:text-4xl font-bold text-center text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
    aria-live="polite"
  >
    {children}
  </h2>
);

const HomePage = () => {
  // --- State Management ---
  const [theme, setTheme] = useState<Theme | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themeData, projectsData, eventsData] = await Promise.all([
          safeFetch<Theme>("/api/theme-of-the-week"), // Assuming this endpoint exists
          safeFetch<{ data: Project[] }>("/api/projects?limit=3"),
          safeFetch<Event[]>("/api/events?limit=3"),
        ]);

        setTheme(themeData[0] || null);
        setProjects(projectsData.data || []);
        setEvents(eventsData);
      } catch (err: any) {
        setError("Failed to load homepage content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Render Logic ---
  return (
    <>
      <Head>
        <title>{churchConfig.name} | Welcome Home</title>
        <meta
          name="description"
          content={churchConfig.vision}
        />
      </Head>

      {/* Custom CSS for crazy animations */}
      <style jsx global>{`
        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes glow {
          0% {
            text-shadow: 0 0 5px rgba(129, 140, 248, 0.5); /* blue-300 */
          }
          50% {
            text-shadow: 0 0 20px rgba(129, 140, 248, 1); /* blue-300 */
          }
          100% {
            text-shadow: 0 0 5px rgba(129, 140, 248, 0.5);
          }
        }
        @keyframes bounceCrazy {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(-5deg);
          }
          75% {
            transform: translateY(-5px) rotate(3deg);
          }
        }
        .rainbow-bg {
          background: linear-gradient(
            270deg,
            #6366f1,
            #ec4899,
            #fbbf24,
            #22c55e,
            #3b82f6
          );
          background-size: 500% 500%;
          animation: rainbow 10s ease infinite;
        }
        .glow-text {
          animation: glow 2s ease-in-out infinite;
        }
        .bounce-crazy {
          animation: bounceCrazy 3s infinite;
        }
        .hover-wild:hover {
          transform: scale(1.05) rotate(2deg);
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.5); /* blue-300 */
        }
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        /* Accessibility focus styles */
        a:focus,
        button:focus {
          outline: 2px solid #818cf8; /* blue-300 */
          outline-offset: 2px;
        }
        /* Ensure sufficient contrast for text */
        .text-gray-400 {
          color: #9ca3af;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      

      {/* Hero Banner with Background Image and Parallax */}
      <section
        className="relative text-white parallax-bg min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero2.png')" }}
        aria-labelledby="hero-heading"
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-70"></div>

        {/* Content */}
        <div className="container mx-auto px-6 py-32 relative z-10 text-center">
          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl font-bold mb-6 glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Welcome to {churchConfig.name}
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in text-gray-300">
            A loving church family where you can grow in faith and serve with
            purpose
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-md text-base transition duration-300 hover-wild shadow-lg"
            >
              Join Us Sunday
            </Link>
            <Link
              href="/about"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 font-bold py-2 px-6 rounded-md text-base transition duration-300 hover-wild shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 bg-gradient-to-br from-gray-900 to-black">
        {/* Church Mission */}
        <section
          className="mb-20 text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-700/30"
          aria-labelledby="mission-heading"
        >
          <h2
            id="mission-heading"
            className="text-2xl font-bold mb-4 relative inline-block glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            <span className="relative z-10">Our Mission</span>
            <span
              className="absolute bottom-0 left-0 w-full h-2 bg-blue-400 z-0"
              style={{ bottom: "5px" }}
              aria-hidden="true"
            ></span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {churchConfig.mission}
          </p>
        </section>

        {/* Featured Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-20" role="list">
          <div
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center border border-gray-700/30"
            role="listitem"
          >
            <div
              className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
              aria-hidden="true"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 glow-text">
              Bible Study
            </h3>
            <p className="text-sm text-gray-400">
              Join our weekly Bible study groups to deepen your understanding of
              Scripture.
            </p>
            <Link
              href="/bible-study"
              className="mt-4 inline-block text-blue-400 hover:text-purple-400 text-sm font-medium"
              aria-label="Learn more about Bible Study"
            >
              Learn more →
            </Link>
          </div>

          <div
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center border border-gray-700/30"
            role="listitem"
          >
            <div
              className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
              aria-hidden="true"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 glow-text">
              Community
            </h3>
            <p className="text-sm text-gray-400">
              Connect with others through our fellowship events and small
              groups.
            </p>
            <Link
              href="/community"
              className="mt-4 inline-block text-blue-400 hover:text-purple-400 text-sm font-medium"
              aria-label="Get involved in Community"
            >
              Get involved →
            </Link>
          </div>

          <div
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center border border-gray-700/30"
            role="listitem"
          >
            <div
              className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
              aria-hidden="true"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 glow-text">
              Sermons
            </h3>
            <p className="text-sm text-gray-400">
              Watch or listen to our weekly messages to nourish your spirit.
            </p>
            <Link
              href="/sermons"
              className="mt-4 inline-block text-blue-400 hover:text-purple-400 text-sm font-medium"
              aria-label="Watch Sermons now"
            >
              Watch now →
            </Link>
          </div>
        </div>
        {/* Weekly Verse with Background Image */}
        <section
          className="mb-20 relative overflow-hidden rounded-2xl shadow-lg parallax-bg"
          style={{ backgroundImage: "url('/images/hero.png')" }}
          aria-labelledby="weekly-inspiration-heading"
        >
          {/* Overlay with subtle dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-70"></div>

          {/* Content */}
          <div className="relative z-10 text-center p-12">
            <h2
              id="weekly-inspiration-heading"
              className="text-2xl font-bold text-white mb-6 glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            >
              Weekly Inspiration
            </h2>
            {theme && (
              <div className="max-w-3xl mx-auto">
                <blockquote className="text-xl font-semibold text-white mb-4 italic glow-text">
                  &ldquo;{theme.verse}&rdquo;
                </blockquote>
                <p className="text-lg text-gray-300 mb-8 glow-text">
                  {theme.reference}
                </p>
                <p className="text-xl font-bold text-white glow-text">
                  Theme of the Week: {theme.title}
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Accomplishments */}
        <section
          className="mb-20 bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-700/30"
          aria-labelledby="accomplishments-heading"
        >
          <h2
            id="accomplishments-heading"
            className="text-2xl font-bold mb-8 text-center glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Making a Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
            <div
              className="relative bg-gray-700/50 p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white border border-gray-600"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div
                className="relative z-10 text-4xl font-bold mb-4"
                aria-label="Over 10,000 meals provided"
              >
                10,000+
              </div>
              <h3 className="relative z-10 text-lg font-semibold mb-2">
                Meals Provided
              </h3>
              <p className="relative z-10 text-sm text-gray-300">
                To families in need through our community outreach programs.
              </p>
            </div>
            <div
              className="relative bg-gray-700/50 p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white border border-gray-600"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div
                className="relative z-10 text-4xl font-bold mb-4"
                aria-label="5 new Bible studies"
              >
                5
              </div>
              <h3 className="relative z-10 text-lg font-semibold mb-2">
                New Bible Studies
              </h3>
              <p className="relative z-10 text-sm text-gray-300">
                Launched this year to help people grow in their faith.
              </p>
            </div>
            <div
              className="relative bg-gray-700/50 p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white border border-gray-600"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div
                className="relative z-10 text-4xl font-bold mb-4"
                aria-label="3 mission trips"
              >
                3
              </div>
              <h3 className="relative z-10 text-lg font-semibold mb-2">
                Mission Trips
              </h3>
              <p className="relative z-10 text-sm text-gray-300">
                Supported internationally to spread God&apos;s love globally.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section
          className="mb-20 bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-700/30"
          aria-labelledby="upcoming-events-heading"
        >
          <div className="flex justify-between items-center mb-8">
            <h2
              id="upcoming-events-heading"
              className="text-2xl font-bold glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            >
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-blue-400 hover:text-purple-400 text-sm font-medium"
              aria-label="View all events"
            >
              View all events →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover-wild transition duration-300 border border-gray-700/30"
                  role="listitem"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={event.imageUrl || "/images/community-prayer.png"}
                      alt={`Event image for ${event.title}`}
                      layout="fill"
                      objectFit="cover"
                      loading="lazy"
                      className="hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-blue-400 mb-2">
                      <time dateTime={event.date}>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 glow-text">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{event.location}</p>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-blue-400 hover:text-purple-400 font-medium"
                      aria-label={`Details about ${event.title}`}
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-sm text-gray-400 text-center py-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg">
                No upcoming events found.
              </p>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section
          className="relative mb-20 text-center bg-gradient-to-r from-gray-800 to-black text-white py-16 px-6 rounded-2xl shadow-2xl border border-gray-700/30"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10">
            <h2 id="cta-heading" className="text-2xl font-bold mb-6 glow-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Ready to Visit Us?
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300">
              We'd love to welcome you this Sunday at 9:00 AM or 11:00 AM.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/services"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-md text-base transition duration-300 hover-wild shadow-lg"
              >
                Service Times
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 font-bold py-2 px-6 rounded-md text-base transition duration-300 hover-wild shadow-lg"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
};

export default HomePage;
