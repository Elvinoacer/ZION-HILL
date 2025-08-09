"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Resources</h1>
        <p className="text-lg text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Resources</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Resources</h1>
      <p className="text-lg text-gray-600 mb-4">
        Access a variety of resources including documents, audio, and video.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Type: {resource.type}</p>
                <p className="text-gray-600 mb-2">Tags: {resource.tags.join(', ')}</p>
                <p className="text-gray-600">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Resource
                  </a>
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No resources available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;