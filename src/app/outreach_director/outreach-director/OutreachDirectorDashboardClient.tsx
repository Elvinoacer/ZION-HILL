"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  User,
  Map,
  BarChart2,
  Handshake,
  Globe,
  Users,
  MapPin,
  TrendingUp,
} from "lucide-react";
import MissionTrips from "@/components/admin/mission-outreach-dash/MissionTrips";
import FundraisingTracker from "@/components/admin/mission-outreach-dash/FundraisingTracker";
import MissionarySupport from "@/components/admin/mission-outreach-dash/MissionarySupport";
import OutreachCoordination from "@/components/admin/mission-outreach-dash/OutreachCoordination";
import ReportingTools from "@/components/admin/mission-outreach-dash/ReportingTools";
import PartnershipPortal from "@/components/admin/mission-outreach-dash/PartnershipPortal";
import { useMissionOutreachStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatCard = ({ icon: Icon, title, value, colorClass, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
  >
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden group">
      <CardContent className="p-5 flex items-center space-x-4">
        <div
          className={`p-4 rounded-full bg-gradient-to-br ${colorClass} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function MissionOutreachDashboard() {
  const [activeSection, setActiveSection] = useState("mission-trips");
  const [isMobile, setIsMobile] = useState(false);

  const {
    itineraries,
    fundraisers,
    missionaries,
    documents,
    outreachLocations,
    volunteers,
    partners,
    sharedDocuments,
    loading,
    error,
    fetchItineraries,
    fetchFundraisers,
    fetchMissionaries,
    fetchDocuments,
    fetchOutreachLocations,
    fetchVolunteers,
    fetchPartners,
    fetchSharedDocuments,
  } = useMissionOutreachStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchItineraries(),
        fetchFundraisers(),
        fetchMissionaries(),
        fetchDocuments(),
        fetchOutreachLocations(),
        fetchVolunteers(),
        fetchPartners(),
        fetchSharedDocuments(),
      ]);
    };
    fetchData();
  }, [
    fetchItineraries,
    fetchFundraisers,
    fetchMissionaries,
    fetchDocuments,
    fetchOutreachLocations,
    fetchVolunteers,
    fetchPartners,
    fetchSharedDocuments,
  ]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sections = [
    { id: "mission-trips", label: "Mission Trips", icon: Calendar },
    { id: "fundraising", label: "Fundraising", icon: DollarSign },
    { id: "missionary-support", label: "Missionary Support", icon: User },
    { id: "outreach", label: "Outreach", icon: Map },
    { id: "reporting", label: "Reporting", icon: BarChart2 },
    { id: "partnerships", label: "Partnerships", icon: Handshake },
  ];

  const stats = [
    {
      title: "Mission Trips",
      value: itineraries.length,
      icon: Calendar,
      colorClass: "from-blue-400 to-blue-600",
    },
    {
      title: "Active Fundraisers",
      value: fundraisers.filter((f) => f.status === "active").length,
      icon: DollarSign,
      colorClass: "from-green-400 to-green-600",
    },
    {
      title: "Missionaries",
      value: missionaries.length,
      icon: User,
      colorClass: "from-purple-400 to-purple-600",
    },
    {
      title: "Outreach Locations",
      value: outreachLocations.length,
      icon: MapPin,
      colorClass: "from-orange-400 to-orange-600",
    },
    {
      title: "Volunteers",
      value: volunteers.length,
      icon: Users,
      colorClass: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Active Partners",
      value: partners.filter((p) => p.status === "active").length,
      icon: Handshake,
      colorClass: "from-pink-400 to-pink-600",
    },
  ];

  const totalFundsRaised = fundraisers.reduce(
    (total, f) => total + (f.amountRaised || 0),
    0
  );
  const fundraisingGoal = fundraisers.reduce(
    (total, f) => total + (f.goal || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl border-2 border-red-200">
          <CardHeader className="text-center pt-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center"
            >
              <div className="text-5xl">⚠️</div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-800 mt-4">
              Dashboard Error
            </CardTitle>
            <p className="text-gray-600 mt-2 px-4">{error}</p>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all"
            >
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-8xl mx-auto">
        <motion.header
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/80">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Mission & Outreach
                </h1>
                <p className="text-md text-gray-600">
                  Your central hub for global and local impact.
                </p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all">
              Create New Initiative
            </Button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6 mb-8 md:mb-10">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>

        {fundraisingGoal > 0 && (
          <motion.div
            className="mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-gray-200/50">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-500" />
                  Fundraising Momentum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-gray-800">
                    ${totalFundsRaised.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Goal: ${fundraisingGoal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        (totalFundsRaised / fundraisingGoal) * 100
                      )}%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3 text-right">
                  {((totalFundsRaised / fundraisingGoal) * 100).toFixed(1)}%
                  funded
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="sticky top-4 z-10 mb-8">
          {isMobile ? (
            <Select value={activeSection} onValueChange={setActiveSection}>
              <SelectTrigger className="w-full h-14 text-lg bg-white/80 backdrop-blur-sm shadow-md border-gray-200/80 rounded-xl">
                <SelectValue placeholder="Select a section..." />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    <div className="flex items-center gap-3 py-1">
                      <section.icon className="h-5 w-5" />
                      <span className="text-lg">{section.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Tabs
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 w-full bg-white/70 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-200/80 h-16">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="text-base font-semibold text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg rounded-lg py-3 transition-all duration-300"
                  >
                    <section.icon className="h-5 w-5 mr-2.5" />
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeSection === "mission-trips" && (
                <MissionTrips itineraries={itineraries} />
              )}
              {activeSection === "fundraising" && (
                <FundraisingTracker fundraisers={fundraisers} />
              )}
              {activeSection === "missionary-support" && (
                <MissionarySupport
                  missionaries={missionaries}
                  documents={documents}
                />
              )}
              {activeSection === "outreach" && (
                <OutreachCoordination
                  locations={outreachLocations}
                  volunteers={volunteers}
                />
              )}
              {activeSection === "reporting" && <ReportingTools />}
              {activeSection === "partnerships" && (
                <PartnershipPortal
                  partners={partners}
                  sharedDocuments={sharedDocuments}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
