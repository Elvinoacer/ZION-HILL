"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeFetch } from '@/lib/api';
import { motion } from "framer-motion";
import { Calendar, MapPin, Tag, Loader2, AlertTriangle } from "lucide-react"; // Added icons

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="text-lg font-medium text-blue-600">Loading our services...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600">Error: {error}. Please try again.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("/images/hero2.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold tracking-tight mb-4"
          >
            Our Church Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light opacity-90 leading-relaxed"
          >
            Discover the heart of our community through our diverse services, designed to uplift, inspire, and connect.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <Card>
                  <CardHeader className="bg-blue-50 p-6 border-b border-blue-100">
                    <CardTitle className="text-2xl font-bold text-blue-800">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Tag className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Type:</span> {service.type}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Date:</span> {new Date(service.date).toLocaleDateString()}
                    </div>
                    {service.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">Location:</span> {service.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">No Services Scheduled Yet</h2>
            <p className="text-lg text-gray-500">Please check back soon for updates on our upcoming services.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;