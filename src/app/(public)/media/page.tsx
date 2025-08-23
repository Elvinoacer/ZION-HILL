"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
}

const MediaGalleryPage = () => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaAssets = async () => {
      try {
        const data = await safeFetch<MediaAsset[]>('/api/media');
        setMediaAssets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaAssets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex flex-col items-center justify-center animate-fade-in">
        <div className="container mx-auto max-w-6xl text-center">
          <Skeleton className="h-10 w-64 sm:w-80 bg-gray-700 mb-6 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-48 bg-gray-700 rounded-md mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <div className="container mx-auto max-w-xl text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/30">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
            Error Loading Media
          </h1>
          <p className="text-lg text-red-400 mb-4">
            Oops! Something went wrong.
          </p>
          <p className="text-md text-gray-400">
            Details: {error}. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4 sm:mb-6 text-center md:text-left">
          Our Media Gallery
        </h1>
        <p className="text-lg text-gray-300 mb-6 sm:mb-8 text-center md:text-left">
          Explore our collection of inspiring photos and videos from church events, services, and community activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaAssets.length > 0 ? (
            mediaAssets.map((asset) => (
              <Card key={asset.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-white">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {asset.type.startsWith('IMAGE') ? (
                    <img src={asset.url} alt={asset.title} className="w-full h-48 object-cover rounded-md mb-3 shadow-md" />
                  ) : asset.type.startsWith('VIDEO') ? (
                    <video src={asset.url} controls className="w-full h-48 object-cover rounded-md mb-3 shadow-md" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-md mb-3 text-gray-400 text-center p-4">
                      <p>Unsupported media type: <span className="font-medium">{asset.type}</span></p>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mb-1">
                    <span className="font-semibold">Type:</span> {asset.type}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <span className="font-semibold">Tags:</span> {asset.tags.join(', ')}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg">
              <p className="text-xl text-gray-400">
                No media assets available at the moment. Please check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGalleryPage;
