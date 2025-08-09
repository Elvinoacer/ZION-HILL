"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';

interface Service {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await safeFetch<Service[]>('/api/services');
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h1>
        <p className="text-lg text-gray-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h1>
      <p className="text-lg text-gray-600 mb-4">
        Explore the various services we offer to our community.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Type: {service.type}</p>
                <p className="text-gray-600 mb-2">Date: {new Date(service.date).toLocaleDateString()}</p>
                {service.location && <p className="text-gray-600">Location: {service.location}</p>}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No services available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;