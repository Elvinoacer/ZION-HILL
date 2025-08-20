"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Heart,
  Lightbulb,
  Handshake,
  Award,
  Mail,
  XCircle,
  MapPin,
  ArrowRight,
  Church,
  Star,
  Target,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Theme {
  id: string;
  title: string;
  verse: string;
  reference: string;
  createdAt: string;
}

interface ServiceEvent {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
  description?: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role?: string;
}

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weeklyTheme, setWeeklyTheme] = useState<Theme | null>(null);
  const [featuredServices, setFeaturedServices] = useState<ServiceEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ServiceEvent[]>([]);
  const [leadership, setLeadership] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themeRes, servicesRes, eventsRes, usersRes] = await Promise.all([
          fetch("/api/theme-of-the-week"),
          fetch("/api/services?type=SERVICE"),
          fetch("/api/events?type=EVENT&limit=3"),
          fetch("/api/users"),
        ]);

        if (!themeRes.ok) throw new Error("Failed to fetch theme of the week");
        if (!servicesRes.ok) throw new Error("Failed to fetch services");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        if (!usersRes.ok) throw new Error("Failed to fetch users");

        const themes: Theme[] = await themeRes.json();
        setWeeklyTheme(themes.length > 0 ? themes[0] : null);

        const servicesData: ServiceEvent[] = await servicesRes.json();
        setFeaturedServices(servicesData.slice(0, 3));

        const eventsData: ServiceEvent[] = await eventsRes.json();
        setUpcomingEvents(eventsData);

        const usersData: User[] = await usersRes.json();
        const filteredLeaders = usersData
          .filter(
            (user) =>
              user.name?.toLowerCase().includes("pastor") ||
              user.name?.toLowerCase().includes("leader") ||
              user.name?.toLowerCase().includes("coordinator") ||
              user.email?.toLowerCase().includes("pastor")
          )
          .slice(0, 4);
        setLeadership(filteredLeaders);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data for About page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const missionStatement =
    "Our mission is to glorify God by making disciples of Jesus Christ who love God, love others, and serve the world. We are committed to fostering a vibrant community where faith is nurtured, lives are transformed, and God's love is shared abundantly.";
  const visionStatement =
    "To be a beacon of hope and transformation, impacting our city and beyond with the message of Christ's love and grace.";

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Love & Compassion",
      description: "Extending God's unconditional love to all.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Spiritual Growth",
      description:
        "Fostering deep understanding and application of God's Word.",
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Community & Fellowship",
      description:
        "Building strong, supportive relationships within the church family.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Service & Outreach",
      description: "Actively serving our local and global communities.",
    },
  ];

  const accomplishments = [
    "Established a successful community feeding program, serving over 5,000 meals annually.",
    "Launched a youth mentorship initiative, connecting young people with positive role models.",
    "Completed the new sanctuary expansion project, increasing seating capacity by 30%.",
    "Sent 3 mission teams to support international relief efforts in the past year.",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <XCircle size={24} /> {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero/Banner Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-cover bg-center rounded-2xl shadow-xl overflow-hidden"
          style={{
            backgroundImage: "url('/images/hero2.png')",
            minHeight: "480px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/70 flex flex-col items-center justify-center text-center p-8">
            <div className="max-w-4xl space-y-6">
              <Church className="h-12 w-12 text-white mx-auto opacity-90" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome to Our Church Family
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Where faith grows, hope shines, and love connects.
              </p>
              {weeklyTheme && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
                >
                  <p className="text-lg font-semibold text-white italic mb-2">
                    "{weeklyTheme.verse}"
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <span className="inline-flex items-center text-blue-100 bg-blue-800/30 px-3 py-1 rounded-full text-sm">
                      <Target className="h-4 w-4 mr-1" />
                      {weeklyTheme.title}
                    </span>
                    <span className="text-sm text-blue-100">
                      {weeklyTheme.reference}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <Card className="p-8 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="items-center p-0 mb-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-700">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-slate-700 leading-relaxed text-center">
                {missionStatement}
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-purple-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="items-center p-0 mb-6">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-700">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-slate-700 leading-relaxed text-center">
                {visionStatement}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* What We Stand For (Values) Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              These principles guide everything we do as a church community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="h-full text-center p-6 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 group">
                  <CardHeader className="flex flex-col items-center p-0 mb-4">
                    <div className="bg-blue-50 p-3 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                      <div className="text-blue-600">{value.icon}</div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-slate-600 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Journey & Accomplishments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white p-10 rounded-2xl shadow-md border border-slate-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Journey & Accomplishments
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Celebrating God's faithfulness through the years
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {accomplishments.slice(0, 2).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start p-4 bg-slate-50 rounded-lg"
                >
                  <Award className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="space-y-2">
              {accomplishments.slice(2, 4).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-start p-4 bg-slate-50 rounded-lg"
                >
                  <Award className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Featured Services/Programs Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Featured Services & Programs
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Join us for worship, fellowship, and spiritual growth
            </p>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <Card className="h-full p-6 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
                    <CardHeader className="flex flex-row items-start space-x-4 p-0 mb-4">
                      <div className="bg-purple-100 p-2 rounded-md group-hover:bg-purple-200 transition-colors">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-slate-800">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-slate-600 mb-4 text-sm">
                        {service.description || "No description available."}
                      </p>
                      <div className="flex items-center text-sm text-slate-500 gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(service.date).toLocaleDateString()}
                        </span>
                        {service.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <MapPin size={16} />
                            <span>{service.location}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10 bg-slate-50 rounded-xl">
              No featured services available at the moment.
            </p>
          )}
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-white p-10 rounded-2xl shadow-md border border-slate-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Mark your calendar and join us for these special gatherings
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-start p-6 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="bg-blue-100 p-2 rounded-md group-hover:bg-blue-200 transition-colors mr-4 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-slate-500 gap-2 flex-wrap">
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.location && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 ml-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10 bg-slate-100 rounded-lg">
              No upcoming events scheduled at the moment.
            </p>
          )}
        </motion.section>

        {/* Leadership Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Leadership
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Dedicated servants guiding our church community
            </p>
          </div>

          {leadership.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <Card className="h-full text-center p-6 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-col items-center p-0 mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-800 text-2xl font-bold mb-4 ring-4 ring-white shadow-inner">
                        {person.name?.charAt(0) ||
                          person.email?.charAt(0) ||
                          "?"}
                      </div>
                      <CardTitle className="text-xl font-semibold text-slate-800">
                        {person.name || person.email}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-blue-600 font-medium">
                        {person.role || "Church Leader"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10 bg-slate-50 rounded-xl">
              Leadership information not available at the moment.
            </p>
          )}
        </motion.section>

        {/* Call to Action: Become a Member / Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-12 rounded-2xl shadow-xl text-center"
        >
          <div className="max-w-3xl mx-auto">
            <Star className="h-12 w-12 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Join Our Church Family!</h2>
            <p className="text-lg mb-8 opacity-90">
              Whether you're looking for a spiritual home, seeking support, or
              want to contribute to our community, we welcome you with open
              arms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-md font-semibold transition-all hover:scale-105"
              >
                Become a Member
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-700 text-lg px-8 py-6 rounded-full shadow-md font-semibold transition-all hover:scale-105"
              >
                Support Our Ministry
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Contact/Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="bg-white p-10 rounded-2xl shadow-md border border-slate-100 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-700 mb-8 text-lg">
            Have questions or need support? We're here to help.
          </p>
          <div className="inline-flex items-center gap-3 text-blue-600 bg-blue-50 px-6 py-4 rounded-xl">
            <Mail size={24} />
            <p className="text-lg font-medium">info@ourchurch.org</p>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            We typically respond within 24 hours
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutPage;
