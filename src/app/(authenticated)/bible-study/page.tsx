"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BibleStudy {
  id: string;
  title: string;
  description?: string;
}

const BibleStudyPage = () => {
  const [bibleStudies, setBibleStudies] = useState<BibleStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBibleStudies = async () => {
      try {
        const res = await fetch('/api/bible-study');
        if (!res.ok) throw new Error('Failed to fetch Bible studies');
        const data = await res.json();
        setBibleStudies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBibleStudies();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Studies</h1>
        <p className="text-lg text-gray-600">Loading Bible studies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Studies</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Studies</h1>
      <p className="text-lg text-gray-600 mb-4">
        Engage in our various Bible study programs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bibleStudies.length > 0 ? (
          bibleStudies.map((study) => (
            <Card key={study.id}>
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{study.description || 'No description available.'}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No Bible studies available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default BibleStudyPage;