"use client";
import { use, useState, useEffect } from "react";
import CourseTabs from "./CourseTabs";
import Link from "next/link";
import {
  BookOpenIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  lessons: any[];
  enrollments: any[];
}

export default function ManageCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const unwrappedParams = use(params); // Unwrap the params object
  const { courseId } = unwrappedParams;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`); // Use destructured courseId
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await response.json();
        setCourse(courseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]); // Use destructured courseId in dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700/60">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <BookOpenIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error ? "Error Loading Course" : "Course Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The requested course could not be found in our system."}
          </p>
          <Link
            href="/discipleship_leader/admin"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Calculate course stats
  const totalLessons = course.lessons.length;
  const totalEnrollments = course.enrollments.length;
  const completedEnrollments = course.enrollments.filter(
    (e) => e.progress.length === totalLessons
  ).length;
  const completionRate =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

  // Calculate active enrollments (enrolled in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeEnrollments = course.enrollments.filter(
    (e) => new Date(e.enrolledAt) >= thirtyDaysAgo
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <Link
                href="/discipleship_leader/admin"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to all courses
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                {course.description || "No description provided"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/discipleship_leader/admin/courses/${courseId}/edit`}
                className="inline-flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Course
              </Link>
              <Link
                href={`/discipleship_leader/admin/new?duplicate=${courseId}`}
                className="inline-flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                Duplicate Course
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                    <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Lessons
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {totalLessons}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                    <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Enrollments
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {totalEnrollments}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                    <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Completion Rate
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {completionRate}%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow rounded-xl border border-gray-200 dark:border-gray-700/60"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
                    <AcademicCapIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Students
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {activeEnrollments}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Course Duration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow rounded-xl border border-gray-200 dark:border-gray-700/60"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
                  <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Course Duration
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(course.startDate).toLocaleDateString()} -{" "}
                    {new Date(course.endDate).toLocaleDateString()}
                  </dd>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.ceil(
                      (new Date(course.endDate).getTime() -
                        new Date(course.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days total
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/60"
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6">
              <CourseTabs course={course} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
