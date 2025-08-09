"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { safeFetch } from "@/lib/api";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  description: string;
  goal: number;
  progress: number;
  imageUrl?: string;
  fundraisingGoal?: number;
  fundraisingProgress?: number;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await safeFetch<{
          data: Project[];
          pagination: Pagination;
        }>(`/api/projects?page=${currentPage}&limit=6`);
        setProjects(response.data);
        setPagination(response.pagination);
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
    // Show initial loading state only
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Our Community Projects
        </h1>
        <p className="text-lg text-center text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Our Community Projects
        </h1>
        <p className="text-lg text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our Community Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us in making a difference. Here are the projects we are
            passionately working on to serve our community and spread His love.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading more projects...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-56">
                    <Image
                      src={project.imageUrl || "/images/default-2.png"}
                      alt={project.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-3 text-gray-800">
                    {project.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-4 h-24 overflow-y-auto">
                    {project.description}
                  </p>

                  {project.fundraisingGoal && project.fundraisingGoal > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          ${project.fundraisingProgress?.toLocaleString()} / $
                          {project.fundraisingGoal.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-green-600">
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
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Donate Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Volunteer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No projects available at the moment.
            </p>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <Button
              onClick={handlePrevPage}
              disabled={loading || pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={
                loading || pagination.currentPage === pagination.totalPages
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
