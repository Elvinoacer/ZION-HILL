"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  goal: number;
  progress: number;
  imageUrl?: string;
  fundraisingGoal?: number;
  fundraisingProgress?: number;
  category?: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

import Link from "next/link";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [donationPlans, setDonationPlans] = useState<any[]>([]);
  const [volunteeringOpportunities, setVolunteeringOpportunities] = useState<
    any[]
  >([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const [
          projectsResponse,
          donationPlansResponse,
          volunteeringOpportunitiesResponse,
        ] = await Promise.all([
          safeFetch<{ data: Project[]; pagination: Pagination }>(
            `/api/projects?page=${currentPage}&limit=6`
          ),
          safeFetch<any[]>("/api/donation-plans?type=PROJECT"),
          safeFetch<any[]>("/api/volunteering-opportunities?type=PROJECT"),
        ]);
        setProjects(projectsResponse.data);
        setPagination(projectsResponse.pagination);
        setDonationPlans(donationPlansResponse);
        setVolunteeringOpportunities(volunteeringOpportunitiesResponse);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (pagination && pagination.currentPage > 1) {
      setCurrentPage(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      setCurrentPage(pagination.currentPage + 1);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Our Community Projects
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Join us in making a difference. Here are the projects we are
              passionately working on to serve our community and spread His love.
            </p>
            <div className="flex justify-center">
              <div className="h-2 w-24 bg-blue-400 rounded-full"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg rounded-xl overflow-hidden"
              >
                <div className="h-56 bg-gray-700 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                  <div className="h-2 bg-gray-700 rounded-full w-full animate-pulse"></div>
                  <div className="flex gap-4 pt-4">
                    <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <div className="text-center p-8 max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/30">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Our Community Projects
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Join us in making a difference. Here are the projects we are
              passionately working on to serve our community and spread His love.
            </p>
          <div className="flex justify-center">
            <div className="h-2 w-24 bg-blue-400 rounded-full"></div>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-full">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-300 font-medium">
                Loading more projects...
              </span>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.length > 0 ? (
              projects.map((project) => {
                const donationPlan = donationPlans.find(
                  (dp) => dp.name === project.title
                );
                const volunteeringOpportunity = volunteeringOpportunities.find(
                  (vo) => vo.title === `Volunteer for ${project.title}`
                );
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl h-full flex flex-col">
                      <CardHeader className="p-0 relative">
                        <div className="relative w-full h-56">
                          <Image
                            src={project.imageUrl || "/images/default-2.png"}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        {project.category && (
                          <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {project.category}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <div className="flex-grow">
                          <CardTitle className="text-2xl font-bold mb-3 text-white">
                            {project.title}
                          </CardTitle>
                          <p className="text-gray-300 mb-4 line-clamp-3">
                            {project.description}
                          </p>

                          {project.fundraisingGoal &&
                            project.fundraisingGoal > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-400">
                                    KES
                                    {project.fundraisingProgress?.toLocaleString()}{" "}
                                    / KES
                                    {project.fundraisingGoal.toLocaleString()}
                                  </span>
                                  <span className="text-sm font-bold text-blue-400">
                                    {Math.round(
                                      ((project.fundraisingProgress || 0) /
                                        project.fundraisingGoal) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    ((project.fundraisingProgress || 0) /
                                      project.fundraisingGoal) *
                                    100
                                  }
                                  className="h-2 bg-gray-700"
                                  indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-500"
                                />
                              </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6">
                          {donationPlan && (
                            <Link
                              href={`/donations?plan=${donationPlan.id}`}
                              passHref
                            >
                              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md transition-all duration-300 transform hover:scale-105">
                                Donate Now
                              </Button>
                            </Link>
                          )}
                          {volunteeringOpportunity && (
                            <Link
                              href={`/volunteering/${volunteeringOpportunity.id}`}
                              passHref
                            >
                              <Button
                                variant="outline"
                                className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-300"
                              >
                                Volunteer
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg"
              >
                <div className="inline-block p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-white mb-2">
                    No projects available
                  </h3>
                  <p className="text-gray-400">
                    Check back later for new community initiatives.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center mt-12 space-x-4"
          >
            <Button
              onClick={handlePrevPage}
              disabled={loading || pagination.currentPage === 1}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-700/50 px-6 py-2 rounded-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        pagination.currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              {pagination.totalPages > 5 &&
                pagination.currentPage < pagination.totalPages - 2 && (
                  <span className="text-gray-400">...</span>
                )}
            </div>
            <Button
              onClick={handleNextPage}
              disabled={
                loading || pagination.currentPage === pagination.totalPages
              }
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-700/50 px-6 py-2 rounded-lg transition-all"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
