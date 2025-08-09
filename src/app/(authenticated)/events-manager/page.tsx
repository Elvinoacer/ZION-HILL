"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Mail,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventsOverview from "@/components/EventsOverview";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  attendees?: number;
  capacity?: number;
}

interface Financials {
  id: string;
  budget: number;
  expenses: number;
  revenue: number;
  eventId: string;
}

interface Sponsor {
  id: string;
  name: string;
  amount: number;
  contactEmail?: string;
}

const EventsManagerDashboard = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [financials, setFinancials] = useState<Financials[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetching for better performance
        const [eventsRes, financialsRes, sponsorsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/financials"),
          fetch("/api/sponsors"),
        ]);

        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        if (!financialsRes.ok) throw new Error("Failed to fetch financials");
        if (!sponsorsRes.ok) throw new Error("Failed to fetch sponsors");

        const [eventsData, financialsData, sponsorsData] = await Promise.all([
          eventsRes.json(),
          financialsRes.json(),
          sponsorsRes.json(),
        ]);

        setEvents(eventsData);
        setFinancials(financialsData);
        setSponsors(sponsorsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await fetch(
            `/api/messages?recipientId=${session.user.id}&read=false`
          );
          if (!res.ok) throw new Error("Failed to fetch unread messages");
          const data = await res.json();
          setUnreadMessageCount(data.length);
        } catch (err) {
          console.error("Error fetching unread messages:", err);
        }
      }
    };

    const interval = setInterval(fetchUnreadMessages, 30000); // Refresh every 30 seconds
    fetchUnreadMessages(); // Initial fetch

    return () => clearInterval(interval);
  }, [session, status]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Events Manager Dashboard
            </h1>
            <div className="h-4 w-48 bg-gray-200 rounded-full animate-pulse"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm h-48 animate-pulse"
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Events Manager Dashboard
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error: {error}. Please try refreshing the page or contact
                  support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  ).length;
  const totalBudget = financials.reduce(
    (sum, finance) => sum + finance.budget,
    0
  );
  const totalSponsors = sponsors.length;
  const totalSponsorship = sponsors.reduce(
    (sum, sponsor) => sum + sponsor.amount,
    0
  );

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Events Manager Dashboard
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage the complete lifecycle of church events efficiently.
          </motion.p>
        </header>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.section
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Events
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalEvents}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
              <span>{upcomingEvents} upcoming</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </motion.section>

          <motion.section
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Budget
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  $
                  {totalBudget.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
              <span>
                ${totalSponsorship.toLocaleString("en-US")} from sponsors
              </span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </motion.section>

          <motion.section
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sponsors</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalSponsors}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
              <span>View all sponsors</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </motion.section>

          <motion.section
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Messages</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {unreadMessageCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
              <Link href="/events-manager/inbox" className="flex items-center">
                View inbox <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.section>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Events Section */}
          <motion.section
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Events
              </h2>
              <Link
                href="/events-manager/create"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
              >
                Create New <Plus className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="space-y-4">
                {events
                  .filter((event) => new Date(event.date) >= new Date())
                  .slice(0, 5)
                  .map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 4 }}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {event.location && ` • ${event.location}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {event.type}
                          </span>
                          {event.attendees !== undefined &&
                            event.capacity !== undefined && (
                              <p className="text-xs text-gray-500 mt-1">
                                {event.attendees}/{event.capacity} attendees
                              </p>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                {events.filter((event) => new Date(event.date) >= new Date())
                  .length > 5 && (
                  <div className="text-center mt-4">
                    <Link
                      href="/events-manager/events"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      View all events <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No events
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new event.
                </p>
                <div className="mt-6">
                  <Link
                    href="/events-manager/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Event
                  </Link>
                </div>
              </div>
            )}
          </motion.section>

          {/* Financials & Sponsors Section */}
          <div className="space-y-6">
            <motion.section
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Financial Overview
              </h2>
              {financials.length > 0 ? (
                <div className="space-y-4">
                  {financials.slice(0, 3).map((finance) => {
                    const event = events.find((e) => e.id === finance.eventId);
                    return (
                      <div
                        key={finance.id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {event?.title || `Event ${finance.eventId}`}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Budget: $
                              {finance.budget.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${
                                finance.revenue - finance.expenses >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              $
                              {(
                                finance.revenue - finance.expenses
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(
                                (finance.revenue / finance.budget) *
                                100
                              ).toFixed(1)}
                              % of budget
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (finance.expenses / finance.budget) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {financials.length > 3 && (
                    <div className="text-center mt-4">
                      <Link
                        href="/events-manager/financials"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        View all financials{" "}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No financial data
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Financial records will appear here.
                  </p>
                </div>
              )}
            </motion.section>

            <motion.section
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Top Sponsors
                </h2>
                <Link
                  href="/events-manager/sponsors"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {sponsors.length > 0 ? (
                <div className="space-y-4">
                  {sponsors
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3)
                    .map((sponsor) => (
                      <div key={sponsor.id} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {sponsor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ${sponsor.amount.toLocaleString("en-US")}
                          </p>
                          {sponsor.contactEmail && (
                            <p className="text-xs text-gray-400 mt-1">
                              {sponsor.contactEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  {sponsors.length > 3 && (
                    <div className="text-center mt-4">
                      <Link
                        href="/events-manager/sponsors"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        View all sponsors{" "}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No sponsors
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sponsor records will appear here.
                  </p>
                </div>
              )}
            </motion.section>
          </div>
        </div>

        {/* Events Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <EventsOverview events={events} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EventsManagerDashboard;
