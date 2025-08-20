"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Video,
  Mic,
  BookOpen,
  Users,
  Loader2,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const KidsTeensResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    kids: "all",
    teens: "all",
    parents: "all",
  });
  const [allResources, setAllResources] = useState({
    kids: [],
    teens: [],
    parents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("kids");

  const getPreviewComponent = (url: string, type: string) => {
    if (!url) return null;

    const lowerCaseUrl = url.toLowerCase();

    if (type === 'IMAGE' || lowerCaseUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/)) {
      return <img src={url} alt="Preview" className="w-full h-48 object-contain rounded-md" />;
    } else if (type === 'VIDEO' || lowerCaseUrl.match(/\.(mp4|webm|ogg)$/) || lowerCaseUrl.includes('youtube.com') || lowerCaseUrl.includes('youtu.be')) {
      // Basic YouTube embed
      if (lowerCaseUrl.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return (
          <iframe
            className="w-full h-48 rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        );
      } else if (lowerCaseUrl.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('&')[0];
        return (
          <iframe
            className="w-full h-48 rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        );
      } else {
        return (
          <video controls className="w-full h-48 object-contain rounded-md">
            <source src={url} type={`video/${lowerCaseUrl.split('.').pop()}`} />
          </video>
        );
      }
    } else if (type === 'DOCUMENT' || lowerCaseUrl.match(/\.(pdf)$/)) {
      return (
        <iframe
          src={url}
          className="w-full h-48 rounded-md"
          style={{ border: 'none' }}
          title="Document Preview"
        ></iframe>
      );
    } else if (type === 'AUDIO' || lowerCaseUrl.match(/\.(mp3|wav|ogg)$/)) {
      return (
        <audio controls className="w-full rounded-md">
          <source src={url} type={`audio/${lowerCaseUrl.split('.').pop()}`} />
        </audio>
      );
    } else {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
          No preview available for this type.
        </div>
      );
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "AUDIO":
        return <Mic className="h-5 w-5 text-purple-500" />;
      case "IMAGE":
        return <ImageIcon className="h-5 w-5 text-yellow-500" />;
      case "DOCUMENT":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case "RESOURCE":
      case "ACTIVITY":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/kids-teens-resources");
      if (!response.ok) {
        setLoading(false); // Ensure loader is off on HTTP error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const categorizedResources = {
        kids: [],
        teens: [],
        parents: [],
      };

      data.forEach((resource) => {
        if (resource.tags.includes("kids")) {
          categorizedResources.kids.push(resource);
        } else if (resource.tags.includes("teens")) {
          categorizedResources.teens.push(resource);
        } else if (resource.tags.includes("parents")) {
          categorizedResources.parents.push(resource);
        }
      });

      setAllResources(categorizedResources);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setError(error);
      toast.error("Failed to load resources."); // Updated toast call
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const communityPicks = useMemo(() => {
    const all = [
      ...allResources.kids,
      ...allResources.teens,
      ...allResources.parents,
    ];
    // Shuffle and pick a few random resources
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, 4);
  }, [allResources]);

  const recentlyAdded = useMemo(() => {
    const all = [
      ...allResources.kids,
      ...allResources.teens,
      ...allResources.parents,
    ];
    return all
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 4);
  }, [allResources]);

  const filteredResources = useMemo(() => {
    const filterAndSearch = (resources, filter) => {
      return resources
        .filter((resource) => filter === "all" || resource.type === filter)
        .filter((resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return {
      kids: filterAndSearch(allResources.kids, filters.kids),
      teens: filterAndSearch(allResources.teens, filters.teens),
      parents: filterAndSearch(allResources.parents, filters.parents),
    };
  }, [searchTerm, filters, allResources]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  const renderResourceCard = (resource, index) => (
    <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-100 group">
        <div className="relative h-40 overflow-hidden">
          {resource.url && resource.type && getPreviewComponent(resource.url, resource.type) ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              {getPreviewComponent(resource.url, resource.type)}
            </div>
          ) : (
            <img
              src={resource.imageUrl || "/images/resource-placeholder.jpg"}
              alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <Badge variant="secondary" className="absolute top-2 left-2 z-10">
            {resource.type}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
              {resource.title}
            </CardTitle>
            {getIconForType(resource.type)}
          </div>
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {resource.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {resource.duration || "5 min read"}
            </span>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderResourceGrid = (resources, category) => (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {resources.length > 0 ? (
        resources.map((resource, index) => renderResourceCard(resource, index))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">
            No resources found matching your criteria
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderFilter = (category) => {
    const assetTypes = [
      "VIDEO", "AUDIO", "IMAGE", "DOCUMENT", "LOGO", "FONT", "TEMPLATE", "SERMON", "RESOURCE", "ACTIVITY"
    ];
    const options = ["all", ...assetTypes];
    return (
      <Select
        value={filters[category]}
        onValueChange={(value) => handleFilterChange(category, value)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option === "all" ? "All Types" : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-indigo-500" />
        </motion.div>
        <motion.p
          className="mt-6 text-lg text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading resources...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the resources. {error.message}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kids & Teens Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fun, faith-filled content for all ages to grow in their
            spiritual journey
          </p>
        </motion.div>

        {/* Featured Resource */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl rounded-2xl overflow-hidden border-0">
            <div className="flex flex-col lg:flex-row">
              <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                <Badge
                  variant="secondary"
                  className="mb-4 w-fit bg-white/20 backdrop-blur-sm"
                >
                  Featured Resource
                </Badge>
                <h2 className="text-3xl font-bold mb-2">The Armor of God</h2>
                <p className="text-lg mb-6 opacity-90">
                  An interactive video series for teens on spiritual warfare and
                  standing firm in faith.
                </p>
                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-white/90"
                  >
                    Watch Now <Video className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white hover:bg-white/10"
                  >
                    Download Guide <BookOpen className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2 h-64 lg:h-auto">
                <img
                  src="/images/youth-camp.png"
                  alt="Youth Camp"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Curated Collections */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              Community Picks
            </h2>
            <Button variant="ghost" className="text-indigo-600">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {communityPicks.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderResourceCard(resource, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="h-6 w-6 text-blue-500 mr-2" />
              Recently Added
            </h2>
            <Button variant="ghost" className="text-indigo-600">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {recentlyAdded.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderResourceCard(resource, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Main Resources Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for resources..."
                className="pl-10 w-full rounded-full h-12 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="kids"
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <motion.div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3 gap-2 bg-white p-2 rounded-full shadow-sm">
                <TabsTrigger
                  value="kids"
                  className={`rounded-full ${
                    activeTab === "kids"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : ""
                  }`}
                >
                  For Kids
                </TabsTrigger>
                <TabsTrigger
                  value="teens"
                  className={`rounded-full ${
                    activeTab === "teens"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : ""
                  }`}
                >
                  For Teens
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className={`rounded-full ${
                    activeTab === "parents"
                      ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                      : ""
                  }`}
                >
                  For Parents
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="kids">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Kids Resources
                </h3>
                {renderFilter("kids")}
              </div>
              {renderResourceGrid(filteredResources.kids, "kids")}
            </TabsContent>

            <TabsContent value="teens">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Teens Resources
                </h3>
                {renderFilter("teens")}
              </div>
              {renderResourceGrid(filteredResources.teens, "teens")}
            </TabsContent>

            <TabsContent value="parents">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Parent Resources
                </h3>
                {renderFilter("parents")}
              </div>
              {renderResourceGrid(filteredResources.parents, "parents")}
            </TabsContent>
          </Tabs>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default KidsTeensResources;