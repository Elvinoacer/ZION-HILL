'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string | null;
  location: string | null;
  type: string;
  imageUrl?: string;
  time: string | null;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <NoEventsFound />
        )}
      </main>
    </div>
  );
};

const Header = () => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center py-16 md:py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <Calendar className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Church Events</h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">Join us for fellowship, worship, and community gatherings. There's a place for you here.</p>
    </div>
  </motion.header>
);

const EventCard = ({ event, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="h-full"
  >
    <Card className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80 overflow-hidden group">
      <div className="relative h-48 sm:h-56 w-full">
        <Image src={event.imageUrl || '/images/hero.png'} alt={event.title} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-105 rounded-t-2xl" />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs sm:text-sm">{event.type}</Badge>
        </div>
      </div>
      <CardHeader className="p-4 sm:p-6 pb-0">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 sm:space-y-3 text-sm text-gray-600 p-4 sm:p-6">
        <p className="line-clamp-3 text-xs sm:text-sm">{event.description}</p>
        <InfoRow icon={Calendar} text={event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBD'} />
        {event.time && <InfoRow icon={Clock} text={event.time} />}
        {event.location && <InfoRow icon={MapPin} text={event.location} />}
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Link href={`/events/${event.id}`} passHref className="w-full">
          <Button variant="ghost" className="w-full justify-between group text-blue-600 hover:bg-blue-50 text-sm sm:text-base py-2.5 sm:py-3">
            View Details <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
    <span className="text-xs sm:text-sm">{text}</span>
  </div>
);

const LoadingState = () => (
  <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="rounded-2xl overflow-hidden animate-pulse shadow-md">
          <div className="h-48 sm:h-56 bg-gray-200"></div>
          <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-1.5 sm:space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="text-center py-16 sm:py-24">
    <AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-red-600">Failed to load events</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">{message}</p>
  </div>
);

const NoEventsFound = () => (
  <div className="text-center py-16 sm:py-24">
    <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-800">No Upcoming Events</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">Please check back later for new events and activities.</p>
  </div>
);

export default EventsPage;
