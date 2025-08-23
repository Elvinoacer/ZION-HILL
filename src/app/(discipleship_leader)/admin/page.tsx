"use client";
import Link from "next/link";
import { getAdminCourses } from "./actions";
import { motion } from "framer-motion";
import {
  FiBook,
  FiPlus,
  FiUsers,
  FiFileText,
  FiCopy,
  FiSettings,
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import { useEffect, useState } from "react";

export default function AdminBibleStudyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/get-admin-course");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setCourses(data.data);
    }
    fetchCourses();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700/60">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <FiAlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Go to Login
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Bible Study Courses
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage all courses and their content
            </p>
          </div>
          <Link
            href="/admin/bible-study/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Course
          </Link>
        </motion.div>

        {/* Stats Overview */}
        {courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <FiBook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Courses
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {courses.length}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                  <FiFileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Lessons
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {courses.reduce(
                      (acc, course) => acc + course.lessonsCount,
                      0
                    )}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                  <FiUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Enrollments
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {courses.reduce(
                      (acc, course) => acc + course.enrollmentsCount,
                      0
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden"
        >
          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Course Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Lessons
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Enrollments
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course, index) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <FiBook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {course.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <FiFileText className="mr-1 h-3 w-3" />
                          {course.lessonsCount}{" "}
                          {course.lessonsCount === 1 ? "Lesson" : "Lessons"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUsers className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.enrollmentsCount}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                            learners
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link
                          href={`/admin/bible-study/${course.id}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          <FiSettings className="mr-1 h-4 w-4" />
                          Manage
                        </Link>
                        <Link
                          href={`/admin/bible-study/new?duplicate=${course.id}`}
                          className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                        >
                          <FiCopy className="mr-1 h-4 w-4" />
                          Duplicate
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <FiBook className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Get started by creating your first Bible study course to engage
                and teach your community.
              </p>
              <Link
                href="/admin/bible-study/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Create Your First Course
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        {courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <FiBarChart2 className="mr-2" />
                Course Analytics
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                Track engagement and completion rates for your courses.
              </p>
              <Link
                href="/admin/analytics"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Analytics
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800/50">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center">
                <FiCalendar className="mr-2" />
                Schedule Management
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                Manage course schedules and enrollment periods.
              </p>
              <Link
                href="/admin/schedule"
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium"
              >
                Manage Schedule
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
