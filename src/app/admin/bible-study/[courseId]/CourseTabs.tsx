"use client";

import { useState } from "react";
import {
  BibleStudyCourse,
  Lesson,
  BibleStudyEnrollment,
} from "@/generated/prisma";
import LessonManager from "./LessonManager";
import EnrollmentViewer from "./EnrollmentViewer";
import {
  BookOpenIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface CourseTabsProps {
  course: BibleStudyCourse & {
    lessons: Lesson[];
    enrollments: (BibleStudyEnrollment & {
      user: any;
      progress: any[];
      quizAttempts: any[];
    })[];
  };
}

export default function CourseTabs({ course }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<"lessons" | "enrollments">(
    "lessons"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const tabClassName = (tabName: string) =>
    `relative flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      activeTab === tabName
        ? "bg-blue-50 text-blue-700 shadow-inner"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveTab("lessons")}
            className={tabClassName("lessons")}
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Lessons</span>
            {activeTab === "lessons" && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("enrollments")}
            className={tabClassName("enrollments")}
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>Enrollments</span>
            {activeTab === "enrollments" && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
            )}
          </button>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
        >
          <ArrowPathIcon
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-50 to-indigo-50"></div>

        <div className="p-6">
          {activeTab === "lessons" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpenIcon className="h-6 w-6 text-blue-500 mr-2" />
                  Course Lessons
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {course.lessons.length}{" "}
                  {course.lessons.length === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>
              <LessonManager course={course} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-indigo-500 mr-2" />
                  Student Enrollments
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {course.enrollments.length}{" "}
                  {course.enrollments.length === 1
                    ? "Enrollment"
                    : "Enrollments"}
                </span>
              </div>
              <EnrollmentViewer enrollments={course.enrollments} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
