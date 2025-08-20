"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface Devotional {
  id: string;
  title: string;
  content: string; // Now stores verse and reference
  createdAt: string;
  // Parsed fields for display
  verse?: string;
  reference?: string;
}

const DevotionalsPage = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevotionals = async () => {
      try {
        const data: Devotional[] = await safeFetch<Devotional[]>('/api/devotionals');
        // Parse content back into verse and reference for display
        const parsedData = data.map(d => {
          const verseMatch = d.content.match(/Verse: (.*) \(Reference: (.*)\)/);
          return {
            ...d,
            verse: verseMatch ? verseMatch[1] : d.content, // Fallback to full content if parsing fails
            reference: verseMatch ? verseMatch[2] : 'N/A',
          };
        });
        setDevotionals(parsedData);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <Skeleton className="h-64 w-full rounded-xl" /> {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-red-500 mb-6 flex items-center justify-center gap-2">
            <XCircle size={24} /> {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-cover bg-center rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundImage: "url('/images/community-prayer.png')", minHeight: '300px' }} // Placeholder image
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Daily Devotionals
            </h1>
            <p className="text-xl text-blue-200 mb-6 max-w-2xl">
              Start your day with spiritual reflection and guidance.
            </p>
          </div>
        </motion.section>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Devotionals</h2>

        {devotionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devotionals.map((devotional) => (
              <motion.div
                key={devotional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-blue-700">{devotional.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{devotional.reference}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 italic mb-4">"{devotional.verse}"</p>
                    <p className="text-gray-500 text-xs">Published: {new Date(devotional.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No devotionals available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DevotionalsPage;
