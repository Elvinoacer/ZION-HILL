"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

interface BibleReadingPlan {
  id: string;
  title: string;
  description?: string;
}

const BibleReadingPlansPage = () => {
  const [plans, setPlans] = useState<BibleReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await safeFetch<BibleReadingPlan[]>('/api/bible-reading-plans');
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Reading Plans</h1>
        <p className="text-lg text-gray-600">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Reading Plans</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Bible Reading Plans</h1>
      <p className="text-lg text-gray-600 mb-4">
        Engage with our structured Bible reading plans.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{plan.description || 'No description available.'}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No Bible reading plans available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default BibleReadingPlansPage;
