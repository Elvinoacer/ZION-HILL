"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from "@/lib/api";

interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  location?: string;
  tags: string[];
}

const FamilyLifePage = () => {
  const [familyEvents, setFamilyEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilyEvents = async () => {
      try {
        const data = await safeFetch<FamilyEvent[]>("/api/family-life");
        setFamilyEvents(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Family Life</h1>
        <p className="text-lg text-gray-600">Loading family events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Family Life</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Family Life</h1>
      <p className="text-lg text-gray-600 mb-4">
        Resources and events to strengthen family bonds and spiritual growth.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyEvents.length > 0 ? (
          familyEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                {event.location && (
                  <p className="text-gray-600 mb-2">
                    Location: {event.location}
                  </p>
                )}
                <p className="text-gray-600">Tags: {event.tags.join(", ")}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">
            No family life events available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default FamilyLifePage;
