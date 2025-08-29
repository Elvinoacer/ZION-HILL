"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Video, Mic, Tag, ExternalLink, Search, XCircle, Inbox } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
}

const typeConfig: { [key: string]: { icon: React.ElementType, color: string } } = {
  document: { icon: FileText, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-400/50" },
  video: { icon: Video, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-400/50" },
  audio: { icon: Mic, color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-400/50" },
  default: { icon: FileText, color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-500/50" },
};

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
                        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-5 w-1/4" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-full rounded-lg" /></CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </div>
);

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) throw new Error("Failed to fetch resources");
        const data = await res.json();
        setResources(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources
      .filter(resource => {
        if (typeFilter !== "all" && resource.type !== typeFilter) return false;
        if (!searchTerm) return true;
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          resource.title.toLowerCase().includes(lowercasedTerm) ||
          resource.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
        );
      });
  }, [resources, searchTerm, typeFilter]);

  if (loading) return <LoadingSkeleton />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 bg-red-50 dark:bg-red-900/20 border-red-500/50">
            <CardHeader><CardTitle className="text-red-600 dark:text-red-400">Error Loading Resources</CardTitle></CardHeader>
            <CardContent><p className="text-red-500 dark:text-red-300">{error}</p></CardContent>
            <CardFooter><Button onClick={() => window.location.reload()} variant="destructive">Try Again</Button></CardFooter>
        </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Resource Library
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                Your central hub for spiritual growth, learning, and community materials.
            </p>
        </motion.div>

        <Card className="mb-8 p-4 sm:p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by title or tag..."
                        className="pl-10 w-full h-12 text-base rounded-xl bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl bg-gray-100 dark:bg-gray-700 border-0">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="document">Documents</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchTerm || typeFilter !== "all") && (
                        <Button variant="ghost" onClick={() => { setSearchTerm(""); setTypeFilter("all"); }} className="h-12 px-3">
                            <XCircle className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>

        <AnimatePresence>
            {filteredResources.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {filteredResources.map((resource) => {
                        const TypeIcon = typeConfig[resource.type]?.icon || typeConfig.default.icon;
                        const typeColor = typeConfig[resource.type]?.color || typeConfig.default.color;
                        return (
                            <motion.div key={resource.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                                <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transform hover:-translate-y-1.5 transition-transform duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug">{resource.title}</CardTitle>
                                            <div className={`p-2 rounded-full ${typeColor.split(' ')[0]}`}>
                                                <TypeIcon className={`h-5 w-5 ${typeColor.split(' ')[1]}`} />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex flex-wrap gap-2">
                                            {resource.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-0 font-normal">
                                                    <Tag className="h-3 w-3 mr-1.5" />{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700/60">
                                        <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <ExternalLink className="h-4 w-4" /> View Resource
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm">
                    <Inbox className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Matching Resources</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Showing {filteredResources.length} of {resources.length} total resources.</p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
