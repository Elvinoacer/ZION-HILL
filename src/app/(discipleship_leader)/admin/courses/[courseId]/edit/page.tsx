"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CertificateFrequency, BibleStudyCourse } from "@/generated/prisma";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiSave,
  FiCalendar,
  FiBook,
  FiAward,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiInfo,
  FiClock,
} from "react-icons/fi";

export default function EditCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [certificateFrequency, setCertificateFrequency] =
    useState<CertificateFrequency>(CertificateFrequency.QUARTERLY);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bible-study/course/${courseId}`);
        if (res.ok) {
          const course: BibleStudyCourse = await res.json();
          setTitle(course.title);
          setDescription(course.description || "");
          setCertificateFrequency(course.certificateFrequency);
          if (course.startDate) setStartDate(course.startDate.split("T")[0]);
          if (course.endDate) setEndDate(course.endDate.split("T")[0]);
        } else {
          setError("Failed to fetch course data.");
        }
      } catch (err) {
        setError("Network error occurred while fetching course.");
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("End date must be after start date.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/bible-study/course/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          certificateFrequency,
          startDate,
          endDate,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/bible-study/${courseId}`);
        }, 1500);
      } else {
        const errorData = await res.json();
        setError(
          errorData.message || `Failed to update course: ${res.statusText}`
        );
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading course data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Link
              href={`/admin/bible-study/${courseId}`}
              className="mr-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center"
            >
              <FiArrowLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Edit Course
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Update the details of your Bible study program
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start"
            >
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <FiX className="h-4 w-4 text-red-500" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg mb-6 flex items-start"
            >
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Course updated successfully! Redirecting...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden"
        >
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="relative">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                    >
                      <FiBook className="mr-2 text-indigo-500" />
                      Course Title <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4 border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. Foundations of Faith"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
                  >
                    <FiInfo className="mr-2 text-indigo-500" />
                    Course Description
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe what students will learn in this course..."
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This will be visible to potential participants
                  </p>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="certificateFrequency"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <FiAward className="mr-2 text-indigo-500" />
                    Certificate Frequency
                  </label>
                  <div className="relative">
                    <select
                      id="certificateFrequency"
                      value={certificateFrequency}
                      onChange={(e) =>
                        setCertificateFrequency(
                          e.target.value as CertificateFrequency
                        )
                      }
                      className="appearance-none block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Object.values(CertificateFrequency).map((freq) => (
                        <option key={freq} value={freq}>
                          {freq.charAt(0) +
                            freq.slice(1).toLowerCase().replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    How often participants receive certificates
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:col-span-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiCalendar className="mr-2 text-indigo-500" />
                      Start Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      When the course begins
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiClock className="mr-2 text-indigo-500" />
                      End Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      When the course concludes
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/bible-study/${courseId}`)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50"
        >
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <FiInfo className="mr-2" />
            Editing Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <FiCheckCircle className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>Keep titles clear and descriptive</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <FiCheckCircle className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>Provide detailed descriptions to attract participants</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-1 mr-2 mt-0.5">
                <FiCheckCircle className="h-3 w-3 text-blue-700 dark:text-blue-300" />
              </div>
              <span>
                Choose appropriate certificate frequency for your course
                structure
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
