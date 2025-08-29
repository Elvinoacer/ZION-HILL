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
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
        {" "}
        {/* Dark theme background and responsive padding */}
        <Skeleton className="h-10 w-32 bg-gray-700" />{" "}
        {/* Dark theme skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-gray-700" />{" "}
          {/* Dark theme skeleton */}
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full bg-gray-800" />{" "}
            {/* Dark theme skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 bg-gray-700" />{" "}
              {/* Dark theme skeleton */}
              <Skeleton className="h-4 w-full bg-gray-700" />{" "}
              {/* Dark theme skeleton */}
              <Skeleton className="h-4 w-3/4 bg-gray-700" />{" "}
              {/* Dark theme skeleton */}
              <Skeleton className="h-4 w-1/2 bg-gray-700" />{" "}
              {/* Dark theme skeleton */}
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {" "}
        {/* Dark theme background and responsive padding */}
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          {" "}
          {/* Dark theme error box */}
          <h2 className="font-bold text-xl sm:text-2xl text-red-400 mb-2">
            Error Loading Opportunity
          </h2>{" "}
          {/* Dark theme text */}
          <p className="text-red-300 mb-6">{error}</p> {/* Dark theme text */}
          <Button
            className="mt-4 bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            {" "}
            {/* Dark theme button */}
            Retry
          </Button>
        </div>
      </div>
    );

  if (!opportunity)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {" "}
        {/* Dark theme background and responsive padding */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          {" "}
          {/* Dark theme not found box */}
          <h2 className="font-bold text-xl sm:text-2xl text-blue-400 mb-2">
            Opportunity Not Found
          </h2>{" "}
          {/* Dark theme text */}
          <p className="text-blue-300 mb-6">
            The requested volunteering opportunity could not be found.
          </p>{" "}
          {/* Dark theme text */}
          <Link href="/admin/projects">
            <Button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white">
              Back to Projects
            </Button>{" "}
            {/* Dark theme button */}
          </Link>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8" /* Dark theme background and responsive padding */
    >
      <div className="mb-6">
        <Link href="/admin/projects">
          <Button
            variant="outline"
            className="gap-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 border-blue-700/50"
          >
            {" "}
            {/* Dark theme button */}
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
        <Card className="overflow-hidden shadow-lg bg-gray-800 border border-gray-700/50">
          {" "}
          {/* Dark theme card */}
          <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-800 text-white">
            {" "}
            {/* Dark theme gradient */}
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {opportunity.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Description
                  </h3>{" "}
                  {/* Dark theme text */}
                  <p className="text-gray-300 whitespace-pre-line">
                    {" "}
                    {/* Dark theme text */}
                    {opportunity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {opportunity.location && (
                    <div className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {" "}
                      {/* Dark theme info box */}
                      <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />{" "}
                      {/* Dark theme icon */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">
                          Location
                        </h4>
                        <p className="text-white">{opportunity.location}</p>{" "}
                        {/* Dark theme text */}
                      </div>
                    </div>
                  )}

                  {opportunity.date && (
                    <div className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {" "}
                      {/* Dark theme info box */}
                      <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />{" "}
                      {/* Dark theme icon */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">
                          Date
                        </h4>
                        <p className="text-white">
                          {" "}
                          {/* Dark theme text */}
                          {new Date(opportunity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {opportunity.duration && (
                    <div className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {" "}
                      {/* Dark theme info box */}
                      <Clock className="h-5 w-5 text-blue-400 mt-0.5" />{" "}
                      {/* Dark theme icon */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">
                          Duration
                        </h4>
                        <p className="text-white">{opportunity.duration}</p>{" "}
                        {/* Dark theme text */}
                      </div>
                    </div>
                  )}

                  {opportunity.skillsRequired && (
                    <div className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {" "}
                      {/* Dark theme info box */}
                      <Users className="h-5 w-5 text-blue-400 mt-0.5" />{" "}
                      {/* Dark theme icon */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">
                          Skills Required
                        </h4>
                        <p className="text-white">
                          {" "}
                          {/* Dark theme text */}
                          {opportunity.skillsRequired}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  {" "}
                  {/* Dark theme background and border */}
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                    {" "}
                    {/* Dark theme text */}
                    <Users className="h-5 w-5 text-blue-400" />{" "}
                    {/* Dark theme icon */}
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
                          className="p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800" /* Dark theme background and border */
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-900/30 p-2 rounded-full">
                              {" "}
                              {/* Dark theme background */}
                              <User className="h-4 w-4 text-blue-400" />{" "}
                              {/* Dark theme icon */}
                            </div>
                            <span className="font-medium text-white">
                              {" "}
                              {/* Dark theme text */}
                              {app.applicant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            {" "}
                            {/* Dark theme text */}
                            <Mail className="h-4 w-4" />
                            <a
                              href={`mailto:${app.applicant.email}`}
                              className="hover:text-blue-400 hover:underline" /* Dark theme link */
                            >
                              {app.applicant.email}
                            </a>
                          </div>
                          {app.applicant.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                              {" "}
                              {/* Dark theme text */}
                              <Phone className="h-4 w-4" />
                              <a
                                href={`tel:${app.applicant.phone}`}
                                className="hover:text-blue-400 hover:underline" /* Dark theme link */
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
