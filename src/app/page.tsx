"use client";

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
    className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
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
        <title>Grace Community Church | Welcome Home</title>
        <meta
          name="description"
          content="Join our loving church community for worship, fellowship, and spiritual growth"
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
            text-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(79, 70, 229, 1);
          }
          100% {
            text-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
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
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
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
          outline: 2px solid #4f46e5;
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

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div
              className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl hover:animate-spin"
              aria-hidden="true"
            >
              GC
            </div>
            <span className="ml-3 text-xl font-bold text-gray-800 glow-text">
              Grace Community
            </span>
          </div>
          <nav
            className="hidden md:flex space-x-8 items-center"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="text-indigo-700 font-medium hover:text-pink-500 transition"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-yellow-500 transition"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-green-500 transition"
            >
              Services
            </Link>
            <Link
              href="/events"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              Events
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-purple-500 transition"
            >
              Contact
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-rainbow-bg transition"
            >
              Become a Member
            </Link>
          </nav>
          <button
            className="md:hidden text-gray-600 hover:rotate-180 transition"
            aria-label="Toggle mobile menu"
            aria-expanded="false"
          >
            <svg
              className="w-6 h-6"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Banner with Background Image and Parallax */}
      <section
        className="relative text-white parallax-bg"
        style={{ backgroundImage: "url('/images/hero2.png')" }}
        aria-labelledby="hero-heading"
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-pink-900 opacity-60"></div>

        {/* Content */}
        <div className="container mx-auto px-6 py-32 relative z-10 text-center">
          <h1
            id="hero-heading"
            className="text-5xl md:text-6xl font-bold mb-6 glow-text"
          >
            Welcome to Grace Community
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">
            A loving church family where you can grow in faith and serve with
            purpose
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="bg-white text-indigo-900 hover:bg-rainbow-bg hover:text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 hover-wild"
            >
              Join Us Sunday
            </Link>
            <Link
              href="/about"
              className="bg-transparent border-2 border-white hover:bg-rainbow-bg hover:text-white hover:border-transparent font-bold py-3 px-8 rounded-lg text-lg transition duration-300 hover-wild"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 rainbow-bg">
        {/* Church Mission */}
        <section
          className="mb-20 text-center bg-white/80 p-8 rounded-3xl shadow-2xl"
          aria-labelledby="mission-heading"
        >
          <h2
            id="mission-heading"
            className="text-3xl font-bold text-indigo-700 mb-4 relative inline-block glow-text"
          >
            <span className="relative z-10">Our Mission</span>
            <span
              className="absolute bottom-0 left-0 w-full h-2 bg-rainbow-bg z-0"
              style={{ bottom: "5px" }}
              aria-hidden="true"
            ></span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            To spread the love of God, foster spiritual growth, and serve our
            community with compassion and dedication. We believe in building
            meaningful relationships that reflect Christ's love to the world.
          </p>
        </section>

        {/* Featured Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-20" role="list">
          <div
            className="bg-white p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center"
            role="listitem"
          >
            <div
              className="bg-rainbow-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
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
            <h3 className="text-xl font-bold text-gray-800 mb-2 glow-text">
              Bible Study
            </h3>
            <p className="text-gray-600">
              Join our weekly Bible study groups to deepen your understanding of
              Scripture.
            </p>
            <Link
              href="/bible-study"
              className="mt-4 inline-block text-indigo-600 hover:text-rainbow-bg font-medium"
              aria-label="Learn more about Bible Study"
            >
              Learn more →
            </Link>
          </div>

          <div
            className="bg-white p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center"
            role="listitem"
          >
            <div
              className="bg-rainbow-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
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
            <h3 className="text-xl font-bold text-gray-800 mb-2 glow-text">
              Community
            </h3>
            <p className="text-gray-600">
              Connect with others through our fellowship events and small
              groups.
            </p>
            <Link
              href="/community"
              className="mt-4 inline-block text-indigo-600 hover:text-rainbow-bg font-medium"
              aria-label="Get involved in Community"
            >
              Get involved →
            </Link>
          </div>

          <div
            className="bg-white p-8 rounded-xl shadow-lg hover-wild transition duration-300 text-center"
            role="listitem"
          >
            <div
              className="bg-rainbow-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"
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
            <h3 className="text-xl font-bold text-gray-800 mb-2 glow-text">
              Sermons
            </h3>
            <p className="text-gray-600">
              Watch or listen to our weekly messages to nourish your spirit.
            </p>
            <Link
              href="/sermons"
              className="mt-4 inline-block text-indigo-600 hover:text-rainbow-bg font-medium"
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
          {/* Overlay with crazy gradient */}
          <div className="absolute inset-0 rainbow-bg opacity-70 mix-blend-multiply"></div>

          {/* Content */}
          <div className="relative z-10 text-center p-12">
            <h2
              id="weekly-inspiration-heading"
              className="text-3xl font-bold text-white mb-6 glow-text"
            >
              Weekly Inspiration
            </h2>
            {theme && (
              <div className="max-w-3xl mx-auto">
                <blockquote className="text-2xl font-semibold text-white mb-4 italic glow-text">
                  &ldquo;{theme.verse}&rdquo;
                </blockquote>
                <p className="text-xl text-white mb-8 glow-text">
                  {theme.reference}
                </p>
                <p className="text-2xl font-bold text-white glow-text">
                  Theme of the Week: {theme.title}
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Accomplishments */}
        <section
          className="mb-20 bg-white/80 p-8 rounded-3xl shadow-2xl"
          aria-labelledby="accomplishments-heading"
        >
          <h2
            id="accomplishments-heading"
            className="text-3xl font-bold text-indigo-700 mb-8 text-center glow-text"
          >
            Making a Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
            <div
              className="relative bg-rainbow-bg p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div
                className="relative z-10 text-5xl font-bold mb-4"
                aria-label="Over 10,000 meals provided"
              >
                10,000+
              </div>
              <h3 className="relative z-10 text-xl font-semibold mb-2">
                Meals Provided
              </h3>
              <p className="relative z-10">
                To families in need through our community outreach programs.
              </p>
            </div>
            <div
              className="relative bg-rainbow-bg p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div
                className="relative z-10 text-5xl font-bold mb-4"
                aria-label="5 new Bible studies"
              >
                5
              </div>
              <h3 className="relative z-10 text-xl font-semibold mb-2">
                New Bible Studies
              </h3>
              <p className="relative z-10">
                Launched this year to help people grow in their faith.
              </p>
            </div>
            <div
              className="relative bg-rainbow-bg p-8 rounded-xl shadow-md hover-wild transition duration-300 text-center text-white"
              role="listitem"
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div
                className="relative z-10 text-5xl font-bold mb-4"
                aria-label="3 mission trips"
              >
                3
              </div>
              <h3 className="relative z-10 text-xl font-semibold mb-2">
                Mission Trips
              </h3>
              <p className="relative z-10">
                Supported internationally to spread God&apos;s love globally.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section
          className="mb-20 bg-white/80 p-8 rounded-3xl shadow-2xl"
          aria-labelledby="upcoming-events-heading"
        >
          <div className="flex justify-between items-center mb-8">
            <h2
              id="upcoming-events-heading"
              className="text-3xl font-bold text-indigo-700 glow-text"
            >
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-indigo-600 hover:text-rainbow-bg font-medium"
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
                  className="bg-white rounded-xl overflow-hidden shadow-md hover-wild transition duration-300"
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
                    <div className="text-sm text-indigo-600 mb-2">
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2 glow-text">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.location}</p>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-indigo-600 hover:text-rainbow-bg font-medium"
                      aria-label={`Details about ${event.title}`}
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-600 text-center">
                No upcoming events found.
              </p>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section
          className="relative mb-20 text-center rainbow-bg text-white py-16 px-6 rounded-2xl shadow-2xl"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10">
            <h2 id="cta-heading" className="text-3xl font-bold mb-6 glow-text">
              Ready to Visit Us?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We'd love to welcome you this Sunday at 9:00 AM or 11:00 AM.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/services"
                className="bg-white text-indigo-900 hover:bg-transparent hover:text-white hover:border-white border-2 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 hover-wild"
              >
                Service Times
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 hover-wild"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative bg-gray-900 text-white pt-16 pb-8 rainbow-bg"
        role="contentinfo"
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4 glow-text">
                Grace Community
              </h3>
              <p className="text-white">
                A place to belong, believe, and become.
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition hover-wild"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition hover-wild"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition hover-wild"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition hover-wild"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 glow-text">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/beliefs"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Our Beliefs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leadership"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Leadership
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ministries"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Ministries
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sermons"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Sermons
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 glow-text">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/devotionals"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Daily Devotionals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/giving"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Online Giving
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prayer"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Prayer Requests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bible-study"
                    className="text-white hover:text-gray-300 transition hover:underline"
                  >
                    Bible Study Tools
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 glow-text">
                Contact Us
              </h4>
              <address className="not-italic text-white">
                <p className="mb-2">123 Faith Avenue</p>
                <p className="mb-2">Springfield, ST 12345</p>
                <p className="mb-2">
                  Phone:{" "}
                  <a href="tel:5551234567" className="hover:text-gray-300">
                    (555) 123-4567
                  </a>
                </p>
                <p className="mb-2">
                  Email:{" "}
                  <a
                    href="mailto:info@gracecommunity.org"
                    className="hover:text-gray-300"
                  >
                    info@gracecommunity.org
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-white text-sm">
            <p>
              © {new Date().getFullYear()} Grace Community Church. All rights
              reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link
                href="/privacy"
                className="hover:text-gray-300 transition glow-text"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-300 transition glow-text"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
