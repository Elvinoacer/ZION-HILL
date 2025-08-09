"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

interface Partner {
  id: string;
  name: string;
  type: string;
  mouUrl?: string;
  contact?: string;
}

const PartnershipsPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await safeFetch<Partner[]>('/api/partnerships');
        setPartners(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Partnerships</h1>
        <p className="text-lg text-gray-600">Loading partnerships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Partnerships</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Partnerships</h1>
      <p className="text-lg text-gray-600 mb-4">
        Collaborating with organizations to expand our reach and impact.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <CardTitle>{partner.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Type: {partner.type}</p>
                {partner.contact && <p className="text-gray-600 mb-2">Contact: {partner.contact}</p>}
                {partner.mouUrl && (
                  <p className="text-gray-600">
                    <a href={partner.mouUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View MOU
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No partnerships available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default PartnershipsPage;
