"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

interface Institution {
  id: string;
  name: string;
  type: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  imageUrl?: string;
}

const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch('/api/institutions');
      if (!res.ok) throw new Error('Failed to fetch institutions');
      const data = await res.json();
      setInstitutions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Institutions</h1>
        <p className="text-lg text-gray-600">Loading institutions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Institutions</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Institutions</h1>
      <p className="text-lg text-gray-600 mb-4">
        Discover the church-owned institutions serving our community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.length > 0 ? (
          institutions.map((institution) => (
            <Card key={institution.id} className="overflow-hidden shadow-lg rounded-lg">
              {institution.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={institution.imageUrl} alt={institution.name} fill className="object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{institution.name}</CardTitle>
                <p className="text-sm text-gray-500">{institution.type}</p>
              </CardHeader>
              <CardContent>
                {institution.description && <p className="text-gray-700 mb-2">{institution.description}</p>}
                {institution.address && <p className="text-sm text-gray-600">Address: {institution.address}</p>}
                {institution.contactInfo && <p className="text-sm text-gray-600">Contact: {institution.contactInfo}</p>}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="md:col-span-3 text-center text-gray-600">No institutions found.</p>
        )}
      </div>
    </div>
  );
};

export default InstitutionsPage;