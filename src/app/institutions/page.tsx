"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { motion } from "framer-motion";

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
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Institutions
            </h1>
            <div className="h-4 w-48 bg-gray-200 rounded-full animate-pulse"></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Our Institutions
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error: {error}. Please try refreshing the page or contact
                  support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <header className="mb-8">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Our Institutions
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Discover the church-owned institutions serving our community.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.length > 0 ? (
          institutions.map((institution) => (
            <Card key={institution.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 rounded-lg">
              {institution.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={institution.imageUrl} alt={institution.name} fill className="object-cover rounded-t-lg" />
                </div>
              )}
              {!institution.imageUrl && (
                <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                  <span className="text-gray-500 text-lg font-medium">No Image</span>
                </div>
              )}
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold text-gray-900">{institution.name}</CardTitle>
                <p className="text-sm text-indigo-600 font-medium">{institution.type}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {institution.description && <p className="text-gray-700 mb-2 text-sm leading-relaxed">{institution.description}</p>}
                {institution.address && <p className="text-sm text-gray-600 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mr-1"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg> {institution.address}</p>}
                {institution.contactInfo && <p className="text-sm text-gray-600 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone mr-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> {institution.contactInfo}</p>}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="md:col-span-3 text-center text-gray-600 py-8 text-lg">No institutions found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default InstitutionsPage;