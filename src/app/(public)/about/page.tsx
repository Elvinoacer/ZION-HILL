"use client";
import BannerCarousel from "@/components/about/BannerCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { churchConfig } from "@/lib/church-config";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  Eye,
  Handshake,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Star,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  description?: string;
  whatsapp?: string;
}

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [weeklyTheme, setWeeklyTheme] = useState<Theme | null>(null);
  const [featuredServices, setFeaturedServices] = useState<ServiceEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ServiceEvent[]>([]);
  const [leadership, setLeadership] = useState<User[]>([]);

  useEffect(() => {
    // Check if device is mobile on initial render and on resize
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themeRes, servicesRes, eventsRes] = await Promise.all([
          fetch("/api/theme-of-the-week"),
          fetch("/api/services?type=SERVICE"),
          fetch("/api/events?type=EVENT&limit=3"),
        ]);

        if (!themeRes.ok) throw new Error("Failed to fetch theme of the week");
        if (!servicesRes.ok) throw new Error("Failed to fetch services");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");

        const themes: Theme[] = await themeRes.json();
        setWeeklyTheme(themes.length > 0 ? themes[0] : null);

        const servicesData: ServiceEvent[] = await servicesRes.json();
        setFeaturedServices(servicesData.slice(0, 3));

        const eventsData: ServiceEvent[] = await eventsRes.json();
        setUpcomingEvents(eventsData);

        const hardcodedTeam = [
          {
            id: "pastor-1",
            name: "Senior Pastor Rev. Dr. David",
            email: "pastor@example.com",
            whatsapp: "254722447848",
            image: "/zion-hill-gallery/church-pastor2.jpg",
            role: "Presbyter Pioneer Section",
            description: "Leads the church with a heart for the community.",
          },
          {
            id: "leader-1",
            name: "Worship Leader Jane",
            email: "jane@example.com",
            whatsapp: "1234567890",
            image: "/zion-hill-gallery/worship-leader1.jpg",
            role: "Worship Leader",
            description: "Leads the congregation in worship every Sunday.",
          },
          {
            id: "coordinator-1",
            name: "Events Coordinator Mike",
            email: "mike@example.com",
            whatsapp: "1234567890",
            image: "/zion-hill-gallery/events-cordinator1.jpg",
            role: "Events Coordinator",
            description: "Organizes all church events and activities.",
          },
          {
            id: "finance-1",
            name: "Finance Admin Sarah",
            email: "sarah@example.com",
            whatsapp: "1234567890",
            image: "/zion-hill-gallery/church-finance-admin1.jpg",
            role: "Finance Administrator",
            description: "Manages the church finances and budget.",
          },
        ];
        setLeadership(hardcodedTeam);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data for About page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const missionStatement = churchConfig.mission;
  const visionStatement = churchConfig.vision;

  const values = [
    {
      icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Love & Compassion",
      description: "Extending God's unconditional love to all.",
    },
    {
      icon: <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Spiritual Growth",
      description:
        "Fostering deep understanding and application of God's Word.",
    },
    {
      icon: <Handshake className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Community & Fellowship",
      description:
        "Building strong, supportive relationships within the church family.",
    },
    {
      icon: <Award className="h-5 w-5 sm:h-6 sm:w-6" />,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-40 w-full rounded-xl sm:h-64" />
          <Skeleton className="h-32 w-full rounded-xl sm:h-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl sm:h-48" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl sm:h-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl sm:h-48" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl sm:h-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl sm:h-48" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl sm:h-48" />
          <Skeleton className="h-24 w-full rounded-xl sm:h-32" />
        </div>
      </div>
    );
  }

  const generateGradient = () => {
    const colors = [
      ["#0f172a", "#1e293b"],
      ["#1e1b4b", "#312e81"],
      ["#4c1d95", "#5b21b6"],
      ["#831843", "#9f1239"],
      ["#047857", "#059669"],
      ["#0c4a6e", "#075985"],
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(to right, ${randomColor[0]}, ${randomColor[1]})`;
  };

  const generateRoleGradient = (role?: string) => {
    switch (role) {
      case "Presbyter Pioneer Section":
        return "linear-gradient(to top right, #4c1d95, #831843)";
      case "Worship Leader":
        return "linear-gradient(to top right, #047857, #0c4a6e)";
      case "Events Coordinator":
        return "linear-gradient(to top right, #1e1b4b, #4c1d95)";
      case "Finance Administrator":
        return "linear-gradient(to top right, #0f172a, #1e1b4b)";
      default:
        return "linear-gradient(to top right, #0f172a, #1e293b)";
    }
  };

  const roleImageMapping: { [key: string]: string[] } = {
    "Senior Pastor": [
      "/zion-hill-gallery/church-pastor.jpg",
      "/zion-hill-gallery/church-pastor2.jpg",
    ],
    "Presbyter Pioneer Section": [
      "/zion-hill-gallery/church-pastor.jpg",
      "/zion-hill-gallery/church-pastor2.jpg",
    ],
    "Worship Leader": [
      "/zion-hill-gallery/worship-leader1.jpg",
      "/zion-hill-gallery/worship-leader2.jpg",
      "/zion-hill-gallery/worship-leader3.jpg",
      "/zion-hill-gallery/worship-leader4.jpg",
    ],
    "Events Coordinator": [
      "/zion-hill-gallery/events-cordinator1.jpg",
      "/zion-hill-gallery/events-coordinator2.jpeg",
      "/zion-hill-gallery/events-coordinator3.jpeg",
    ],
    "Finance Administrator": [
      "/zion-hill-gallery/church-finance-admin1.jpg",
      "/zion-hill-gallery/church-finance-admin2.webp",
      "/zion-hill-gallery/church-finance-admin3.jpg",
      "/zion-hill-gallery/church-finance-admin4.jpeg",
    ],
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center sm:p-8"
        >
          <h1 className="text-2xl font-bold text-white mb-3 sm:text-3xl sm:mb-4">
            Error
          </h1>
          <p className="text-base text-red-500 mb-4 flex items-center justify-center gap-2 sm:text-lg sm:mb-6">
            <XCircle size={20} /> {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base"
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
      className="min-h-screen bg-slate-900 text-white p-4"
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Hero/Banner Section */}
        <BannerCarousel isMobile={isMobile} />

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
        >
          <Card
            className="p-5 ring-1 ring-slate-700 hover:ring-blue-500 transition-all duration-300 sm:p-8"
            style={{ background: generateGradient() }}
          >
            <CardHeader className="items-center p-0 mb-4 sm:mb-6">
              <div className="bg-blue-900 p-2 rounded-full mb-2 sm:p-3 sm:mb-4">
                <Target className="h-6 w-6 text-blue-400 sm:h-8 sm:w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-300 sm:text-2xl">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-slate-200 leading-relaxed text-center sm:text-base">
                {missionStatement}
              </p>
            </CardContent>
          </Card>

          <Card
            className="p-5 ring-1 ring-slate-700 hover:ring-purple-500 transition-all duration-300 sm:p-8"
            style={{ background: generateGradient() }}
          >
            <CardHeader className="items-center p-0 mb-4 sm:mb-6">
              <div className="bg-purple-900 p-2 rounded-full mb-2 sm:p-3 sm:mb-4">
                <Eye className="h-6 w-6 text-purple-400 sm:h-8 sm:w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-purple-300 sm:text-2xl">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-slate-200 leading-relaxed text-center sm:text-base">
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
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl font-bold text-white mb-2 sm:text-4xl sm:mb-4">
              Our Core Values
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto sm:text-base lg:text-lg">
              These principles guide everything we do as a church community
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card
                  className="h-full text-center p-4 ring-1 ring-slate-700 transition-all duration-300 group sm:p-6"
                  style={{ background: generateGradient() }}
                >
                  <CardHeader className="flex flex-col items-center p-0 mb-2 sm:mb-4">
                    <div className="bg-blue-900 p-2 rounded-full mb-2 group-hover:bg-blue-800 transition-colors sm:p-3 sm:mb-4">
                      <div className="text-blue-400">{value.icon}</div>
                    </div>
                    <CardTitle className="text-base font-semibold text-white sm:text-lg lg:text-xl">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-xs text-slate-300 sm:text-sm">
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
          className="p-5 rounded-2xl sm:p-10"
        >
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 sm:text-4xl sm:mb-4">
              Our Journey & Accomplishments
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto sm:text-base lg:text-lg">
              Celebrating God's faithfulness through the years
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              {accomplishments.slice(0, 2).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start p-3 bg-slate-700 rounded-lg sm:p-4"
                >
                  <Award className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-1 sm:h-5 sm:w-5 sm:mr-3" />
                  <span className="text-xs text-slate-200 sm:text-sm">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="space-y-2 sm:space-y-3">
              {accomplishments.slice(2, 4).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-start p-3 bg-slate-700 rounded-lg sm:p-4"
                >
                  <Award className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-1 sm:h-5 sm:w-5 sm:mr-3" />
                  <span className="text-xs text-slate-200 sm:text-sm">
                    {item}
                  </span>
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
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 sm:text-4xl sm:mb-4">
              Featured Services & Programs
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto sm:text-base lg:text-lg">
              Join us for worship, fellowship, and spiritual growth
            </p>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <Card
                    className="h-full p-4 ring-1 ring-slate-700 transition-all duration-300 group overflow-hidden sm:p-6"
                    style={{ background: generateGradient() }}
                  >
                    <CardHeader className="flex flex-row items-start space-x-3 p-0 mb-3 sm:space-x-4 sm:mb-4">
                      <div className="bg-purple-900 p-1.5 rounded-md group-hover:bg-purple-800 transition-colors sm:p-2">
                        <Calendar className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
                      </div>
                      <CardTitle className="text-base font-semibold text-white sm:text-lg lg:text-xl">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-xs text-slate-300 mb-3 sm:text-sm sm:mb-4">
                        {service.description || "No description available."}
                      </p>
                      <div className="flex items-center text-xs text-slate-400 gap-1.5 flex-wrap sm:text-sm sm:gap-2">
                        <Calendar size={14} />
                        <span>
                          {new Date(service.date).toLocaleDateString()}
                        </span>
                        {service.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <MapPin size={14} />
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
            <p className="text-center text-slate-400 py-6 bg-slate-700 rounded-xl sm:py-10">
              No featured services available at the moment.
            </p>
          )}
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="p-5 rounded-2xl sm:p-10"
        >
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 sm:text-4xl sm:mb-4">
              Upcoming Events
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto sm:text-base lg:text-lg">
              Mark your calendar and join us for these special gatherings
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-start p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900 ring-1 ring-slate-700 hover:ring-blue-500 transition-all duration-300 group sm:p-6"
                >
                  <div className="bg-blue-900 p-1.5 rounded-md group-hover:bg-blue-800 transition-colors mr-3 flex-shrink-0 sm:p-2 sm:mr-4">
                    <Calendar className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-semibold text-white mb-1 sm:text-lg">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-1.5 sm:text-sm sm:mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center text-xs text-slate-400 gap-1.5 flex-wrap sm:text-sm sm:gap-2">
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.location && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 ml-2 hidden sm:flex"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-6 bg-slate-700 rounded-lg sm:py-10">
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
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 sm:text-4xl sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mx-auto sm:text-base lg:text-lg">
              Dedicated servants guiding our church community
            </p>
          </div>

          {leadership.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              {leadership.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <Card
                    className="h-full text-center p-4 ring-1 ring-slate-700 transition-all duration-300"
                    style={{ background: generateRoleGradient(person.role) }}
                  >
                    <CardHeader className="flex flex-col items-center p-0 mb-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white text-xl font-bold mb-2 ring-3 ring-white sm:w-20 sm:h-20 sm:text-2xl">
                        {person.image ? (
                          <img
                            src={person.image}
                            alt={person.name || ""}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          person.name?.charAt(0) ||
                          person.email?.charAt(0) ||
                          "?"
                        )}
                      </div>
                      <CardTitle className="text-sm font-semibold text-white sm:text-base">
                        {person.name || person.email}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-xs text-blue-400 font-medium sm:text-sm">
                        {person.role || "Church Leader"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 sm:text-sm">
                        {person.description}
                      </p>
                      <div className="flex justify-center mt-3 space-x-1">
                        <a href={`mailto:${person.email}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          >
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </a>
                        <a
                          href={`https://wa.me/${person.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          >
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-6 bg-slate-700 rounded-xl sm:py-10">
              Leadership information not available at the moment.
            </p>
          )}
        </motion.section>

        {/* Call to Action: Become a Member / Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 rounded-2xl shadow-xl text-center sm:p-12"
        >
          <div className="max-w-3xl mx-auto">
            <Star className="h-8 w-8 text-yellow-300 mx-auto mb-4 sm:h-12 sm:w-12 sm:mb-6" />
            <h2 className="text-2xl font-bold mb-4 sm:text-4xl sm:mb-6">
              Join Our Church Family!
            </h2>
            <p className="text-sm mb-6 opacity-90 sm:text-base lg:text-lg sm:mb-8">
              Whether you're looking for a spiritual home, seeking support, or
              want to contribute to our community, we welcome you with open
              arms.
            </p>
            <div className="flex flex-col gap-3 justify-center sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="bg-slate-800 text-blue-300 hover:bg-slate-700 text-sm px-5 py-4 rounded-full shadow-md font-semibold transition-all hover:scale-105 sm:text-base sm:px-8 sm:py-6"
              >
                Become a Member
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-900 hover:bg-slate-800 hover:text-blue-100 text-sm px-5 py-4 rounded-full shadow-md font-semibold transition-all hover:scale-105 sm:text-base sm:px-8 sm:py-6"
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
          className="p-6 rounded-2xl text-center sm:p-10"
        >
          <h2 className="text-xl font-bold text-white mb-3 sm:text-3xl sm:mb-4">
            Get In Touch
          </h2>
          <p className="text-sm text-slate-200 mb-4 sm:text-base lg:text-lg sm:mb-8">
            Have questions or need support? We're here to help.
          </p>
          <div className="inline-flex items-center gap-2 text-blue-400 bg-blue-900 px-4 py-3 rounded-xl sm:gap-3 sm:px-6 sm:py-4">
            <Mail size={18} className="sm:w-5 sm:h-5" />
            <p className="text-sm font-medium sm:text-base lg:text-lg">
              {churchConfig.contact.email}
            </p>
          </div>
          <p className="text-slate-400 text-xs mt-4 sm:text-sm sm:mt-6">
            We typically respond within 24 hours
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutPage;
