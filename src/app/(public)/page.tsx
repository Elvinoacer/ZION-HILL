"use client";
import { churchConfig } from "@/lib/church-config";
import { safeFetch } from "@/lib/api";
import Head from "next/head";
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
    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"
    aria-live="polite"
  >
    {children}
  </h2>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/40 hover:border-gray-600/60 transition-all duration-500 ${className}`}
  >
    {children}
  </div>
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
          safeFetch<Theme>("/api/theme-of-the-week"),
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
        <meta name="description" content={churchConfig.vision} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Custom CSS for animations and effects */}
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

        @keyframes gradient {
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
            text-shadow: 0 0 2px rgba(129, 140, 248, 0.5);
          }
          50% {
            text-shadow: 0 0 10px rgba(129, 140, 248, 1);
          }
          100% {
            text-shadow: 0 0 2px rgba(129, 140, 248, 0.5);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtleGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
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

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }

        .glow-text {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .subtle-glow {
          animation: subtleGlow 3s ease-in-out infinite;
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Gradient borders */
        .gradient-border {
          position: relative;
          background: linear-gradient(45deg, #6366f1, #ec4899, #fbbf24);
          padding: 2px;
          border-radius: 16px;
        }

        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: #1f2937;
          border-radius: 14px;
          z-index: -1;
        }

        /* High contrast text shadows for better readability */
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }

        .text-shadow-xl {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.9);
        }

        /* Accessibility focus styles */
        a:focus,
        button:focus {
          outline: 2px solid #ffffff;
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* Ensure sufficient contrast for text */
        .text-gray-400 {
          color: #d1d5db;
        }

        .text-gray-600 {
          color: #9ca3af;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .parallax-bg {
            background-attachment: scroll;
          }

          .mobile-stack {
            flex-direction: column !important;
          }

          .mobile-full {
            width: 100% !important;
            max-width: 100% !important;
          }

          .mobile-padding {
            padding: 1.5rem !important;
          }

          .mobile-text-center {
            text-align: center !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
      `}</style>

      {/* Hero Banner with Background Image and Parallax */}
      <section
        className="relative text-white parallax-bg min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/images/hero2.png')" }}
        aria-labelledby="hero-heading"
      >
        {/* Enhanced dark overlay with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95"></div>

        {/* Subtle pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating particles background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
          <div
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-white rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-32 relative z-10 text-center animate-slide-in">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Hero Title with Better Contrast */}
            <div className="mb-8 md:mb-12">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white text-shadow-xl leading-tight"
              >
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-blue-400 to-green-400 animate-gradient border-2 border-white/20 rounded-2xl px-4 py-2 subtle-glow inline-block">
                  {churchConfig.name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl mb-8 md:mb-12 max-w-4xl mx-auto text-white leading-relaxed font-medium text-shadow-lg bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                A loving church family where you can grow in faith and serve
                with purpose
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mobile-stack">
              <Link
                href="/services"
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl text-lg md:text-xl transition-all duration-300 hover-lift shadow-2xl transform hover:scale-105 mobile-full text-center border-2 border-white/20 subtle-glow"
              >
                Join Us Sunday
              </Link>
              <Link
                href="/about"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-xl text-lg md:text-xl transition-all duration-300 hover-lift shadow-2xl transform hover:scale-105 mobile-full text-center text-white hover:text-gray-900"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center backdrop-blur-sm bg-black/20">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <main className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Church Mission */}
        <section
          className="py-16 md:py-24 px-4 sm:px-6"
          aria-labelledby="mission-heading"
        >
          <div className="container mx-auto max-w-6xl">
            <Card className="p-8 md:p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-float">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2
                  id="mission-heading"
                  className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"
                >
                  Our Mission
                </h2>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed md:leading-loose font-light">
                  {churchConfig.mission}
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-gray-800/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How We Serve
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover opportunities to grow, connect, and make a difference
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
              {[
                {
                  icon: (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                  title: "Bible Study",
                  description:
                    "Join our weekly Bible study groups to deepen your understanding of Scripture.",
                  link: "/bible-study",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                  title: "Community",
                  description:
                    "Connect with others through our fellowship events and small groups.",
                  link: "/community",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  ),
                  title: "Sermons",
                  description:
                    "Watch or listen to our weekly messages to nourish your spirit.",
                  link: "/sermons",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-8 text-center hover-lift group"
                  role="listitem"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <Link
                    href={item.link}
                    className="inline-flex items-center text-blue-400 hover:text-purple-400 font-medium transition-colors duration-300 group-hover:translate-x-1"
                  >
                    Learn more
                    <svg
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Weekly Verse */}
        <section
          className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
          aria-labelledby="weekly-inspiration-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <Card className="p-8 md:p-12 text-center gradient-border">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2
                  id="weekly-inspiration-heading"
                  className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"
                >
                  Weekly Inspiration
                </h2>
                {theme && (
                  <div className="space-y-6">
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed md:leading-loose italic text-shadow-lg">
                      &ldquo;{theme.verse}&rdquo;
                    </blockquote>
                    <p className="text-lg md:text-xl text-gray-200 font-medium text-shadow-lg">
                      {theme.reference}
                    </p>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-lg md:text-xl font-bold text-white">
                        Theme of the Week: {theme.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* Accomplishments */}
        <section
          className="py-16 md:py-24 px-4 sm:px-6 bg-gray-800/30"
          aria-labelledby="accomplishments-heading"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Making a Difference
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Together, we're transforming lives and communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
              {[
                {
                  number: "10,000+",
                  label: "Meals Provided",
                  description:
                    "To families in need through our community outreach programs.",
                },
                {
                  number: "5",
                  label: "New Bible Studies",
                  description:
                    "Launched this year to help people grow in their faith.",
                },
                {
                  number: "3",
                  label: "Mission Trips",
                  description:
                    "Supported internationally to spread God's love globally.",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-8 text-center hover-lift group"
                  role="listitem"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {item.label}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section
          className="py-16 md:py-24 px-4 sm:px-6"
          aria-labelledby="upcoming-events-heading"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Upcoming Events
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl">
                  Join us for worship, fellowship, and community events
                </p>
              </div>
              <Link
                href="/events"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover-lift whitespace-nowrap"
              >
                View All Events
              </Link>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
            >
              {events.length > 0 ? (
                events.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover-lift group"
                    role="listitem"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={event.imageUrl || "/images/community-prayer.png"}
                        alt={`Event image for ${event.title}`}
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                        className="group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-blue-400 mb-3 font-medium">
                        <time dateTime={event.date}>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {event.location}
                      </p>
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center text-blue-400 hover:text-purple-400 font-medium transition-colors duration-300 group-hover:translate-x-1"
                      >
                        Event Details
                        <svg
                          className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/40">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg text-gray-300">
                      No upcoming events scheduled
                    </p>
                    <p className="text-gray-400 mt-2">
                      Check back later for new events
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section
          className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30"
          aria-labelledby="cta-heading"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto">
                <h2
                  id="cta-heading"
                  className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"
                >
                  Ready to Visit Us?
                </h2>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  We'd love to welcome you this Sunday at 9:00 AM or 11:00 AM.
                  Experience the warmth of our community and the power of
                  worship.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mobile-stack">
                  <Link
                    href="/services"
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover-lift shadow-2xl transform hover:scale-105 mobile-full text-center border-2 border-white/20"
                  >
                    Service Times
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover-lift shadow-2xl transform hover:scale-105 mobile-full text-center text-white hover:text-gray-900"
                  >
                    Get Directions
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
