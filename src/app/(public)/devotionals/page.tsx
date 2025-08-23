'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { XCircle, BookOpen, Share2, Calendar } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Devotional {
  id: string;
  title: string;
  content: string;
  createdAt: string;
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
        const parsedData = data.map(d => {
          const verseMatch = d.content.match(/Verse: (.*) \(Reference: (.*)\)/);
          return {
            ...d,
            verse: verseMatch ? verseMatch[1] : d.content,
            reference: verseMatch ? verseMatch[2] : 'N/A',
          };
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDevotionals(parsedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevotionals();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {devotionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devotionals.map((devotional, index) => (
              <DevotionalCard key={devotional.id} devotional={devotional} index={index} />
            ))}
          </div>
        ) : (
          <NoDevotionalsFound />
        )}
      </main>
      <Toaster richColors />
    </div>
  );
};

const Header = () => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-16 md:py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Daily Devotionals</h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">A moment of peace and reflection to strengthen your faith each day.</p>
    </div>
  </motion.header>
);

const DevotionalCard = ({ devotional, index }: { devotional: Devotional, index: number }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(`${devotional.title}\n\"${devotional.verse}\" - ${devotional.reference}`);
    toast.success('Devotional copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">{devotional.title}</CardTitle>
          <p className="text-xs sm:text-sm text-blue-600 font-medium pt-0.5 sm:pt-1">{devotional.reference}</p>
        </CardHeader>
        <CardContent className="flex-1 p-4 sm:p-6">
          <blockquote className="relative p-3 sm:p-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg">
            <p className="text-base sm:text-lg italic text-gray-700">\"{devotional.verse}\"</p>
          </blockquote>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-gray-500 p-4 sm:p-6 pt-0 sm:pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(devotional.createdAt).toLocaleDateString()}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleShare}>
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="rounded-2xl overflow-hidden animate-pulse shadow-md">
          <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            <Skeleton className="h-5 sm:h-6 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Skeleton className="h-16 sm:h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="text-center py-16 sm:py-24">
    <XCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-red-600">Failed to load devotionals</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">{message}</p>
  </div>
);

const NoDevotionalsFound = () => (
  <div className="text-center py-16 sm:py-24 col-span-full">
    <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-800">No Devotionals Yet</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">Please check back later for daily inspiration.</p>
  </div>
);

export default DevotionalsPage;
