"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

interface Devotional {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

const DevotionalsPage = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevotionals = async () => {
      try {
        const data = await safeFetch<Devotional[]>('/api/devotionals');
        setDevotionals(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevotionals();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Daily Devotionals</h1>
        <p className="text-lg text-gray-600">Loading devotionals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Daily Devotionals</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Daily Devotionals</h1>
      <p className="text-lg text-gray-600 mb-4">
        Start your day with spiritual reflection and guidance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotionals.length > 0 ? (
          devotionals.map((devotional) => (
            <Card key={devotional.id}>
              <CardHeader>
                <CardTitle>{devotional.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Published: {new Date(devotional.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-2">Tags: {devotional.tags.join(', ')}</p>
                <p className="text-gray-600">
                  <a href={devotional.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Read Devotional
                  </a>
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No devotionals available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default DevotionalsPage;
