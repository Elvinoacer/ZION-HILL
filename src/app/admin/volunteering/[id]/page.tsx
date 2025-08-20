"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { safeFetch } from "@/lib/api";
import { VolunteeringOpportunity } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const VolunteeringOpportunityPage = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] =
    useState<VolunteeringOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await safeFetch<VolunteeringOpportunity>(
          `/api/volunteering-opportunities/${id}`
        );
        setOpportunity(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
          <h2 className="font-bold text-xl mb-2">Error Loading Opportunity</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );

  if (!opportunity)
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
          <h2 className="font-bold text-xl mb-2">Opportunity Not Found</h2>
          <p>The requested volunteering opportunity could not be found.</p>
          <Link href="/admin/projects">
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <Link href="/admin/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {opportunity.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {opportunity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {opportunity.location && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Location
                        </h4>
                        <p className="text-gray-900">{opportunity.location}</p>
                      </div>
                    </div>
                  )}

                  {opportunity.date && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Date
                        </h4>
                        <p className="text-gray-900">
                          {new Date(opportunity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {opportunity.duration && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Duration
                        </h4>
                        <p className="text-gray-900">{opportunity.duration}</p>
                      </div>
                    </div>
                  )}

                  {opportunity.skillsRequired && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Skills Required
                        </h4>
                        <p className="text-gray-900">
                          {opportunity.skillsRequired}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Applicants ({opportunity.applications.length})</span>
                  </h3>

                  {opportunity.applications.length > 0 ? (
                    <ul className="space-y-3">
                      {opportunity.applications.map((app) => (
                        <motion.li
                          key={app.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {app.applicant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a
                              href={`mailto:${app.applicant.email}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {app.applicant.email}
                            </a>
                          </div>
                          {app.applicant.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Phone className="h-4 w-4" />
                              <a
                                href={`tel:${app.applicant.phone}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {app.applicant.phone}
                              </a>
                            </div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No applicants yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default VolunteeringOpportunityPage;
