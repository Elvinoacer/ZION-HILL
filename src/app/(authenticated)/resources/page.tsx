"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FiExternalLink, FiSearch, FiFilter, FiDownload } from "react-icons/fi";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
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
        setFilteredResources(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let results = resources;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      results = results.filter((resource) => resource.type === typeFilter);
    }

    setFilteredResources(results);
  }, [searchTerm, typeFilter, resources]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "audio":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Resources</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error Loading Resources
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Resource Library
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover and access our curated collection of documents, audio, and
          video resources to support your journey.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search resources or tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-500" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <Badge className={`w-fit ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FiExternalLink /> View Resource
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No resources found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || typeFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "There are currently no resources available. Check back later!"}
          </p>
          {(searchTerm || typeFilter !== "all") && (
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {filteredResources.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
