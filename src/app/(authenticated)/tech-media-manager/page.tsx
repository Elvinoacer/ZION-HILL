"use client";

import React, { useEffect, useState } from 'react';

interface Asset {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
}

const TechMediaManagerDashboard = () => {
  const [mediaAssets, setMediaAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Media Assets
        const mediaRes = await fetch('/api/media');
        if (!mediaRes.ok) throw new Error('Failed to fetch media assets');
        const mediaData = await mediaRes.json();
        setMediaAssets(mediaData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Tech & Media Manager Dashboard</h1>
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Tech & Media Manager Dashboard</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tech & Media Manager Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Manage digital infrastructure and content production.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Media Assets</h2>
          {mediaAssets.length > 0 ? (
            <ul>
              {mediaAssets.map((asset) => (
                <li key={asset.id} className="mb-2">
                  <strong>{asset.title}</strong> ({asset.type})
                  <p className="text-gray-600 text-sm">Tags: {asset.tags.join(', ')}</p>
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Asset
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No media assets found.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Streaming & Broadcast</h2>
          <p>Stream control, multi-platform broadcasting, and equipment automation.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Website & App Maintenance</h2>
          <p>Uptime monitoring, performance metrics, and content updates.</p>
        </div>
      </div>
    </div>
  );
};

export default TechMediaManagerDashboard;