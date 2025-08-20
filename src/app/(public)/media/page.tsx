"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

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
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Media Gallery</h1>
        <p className="text-lg text-gray-600">Loading media assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Media Gallery</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Media Gallery</h1>
      <p className="text-lg text-gray-600 mb-4">
        Explore our collection of photos and videos from church events and activities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaAssets.length > 0 ? (
          mediaAssets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <CardTitle>{asset.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {asset.type.startsWith('IMAGE') ? (
                  <img src={asset.url} alt={asset.title} className="w-full h-48 object-cover rounded-md mb-2" />
                ) : asset.type.startsWith('VIDEO') ? (
                  <video src={asset.url} controls className="w-full h-48 object-cover rounded-md mb-2" />
                ) : (
                  <p className="text-gray-600 mb-2">Unsupported media type: {asset.type}</p>
                )}
                <p className="text-gray-600 mb-2">Type: {asset.type}</p>
                <p className="text-gray-600">Tags: {asset.tags.join(', ')}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No media assets available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default MediaGalleryPage;
