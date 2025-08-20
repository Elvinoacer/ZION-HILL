import { PrismaClient } from "@/generated/prisma";
import CourseTabs from "./CourseTabs";
import Link from "next/link";
import {
  BookOpenIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const prisma = new PrismaClient();

async function getCourse(courseId: string) {
  const course = await prisma.bibleStudyCourse.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
      enrollments: {
        include: {
          user: true,
          progress: true,
          quizAttempts: true,
        },
      },
    },
  });
  return course;
}

export default async function ManageCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourse(params.courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <BookOpenIcon className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested course could not be found in our system.
          </p>
          <Link
            href="/admin/bible-study"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

  const plainCourse = {
    ...course,
    startDate: course.startDate.toISOString(),
    endDate: course.endDate.toISOString(),
    lessons: course.lessons.map((lesson) => ({
      ...lesson,
      createdAt: lesson.createdAt?.toISOString() || null,
      updatedAt: lesson.updatedAt?.toISOString() || null,
    })),
    enrollments: course.enrollments.map((enrollment) => ({
      ...enrollment,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      user: {
        ...enrollment.user,
        emailVerified: enrollment.user.emailVerified?.toISOString() || null,
        createdAt: enrollment.user.createdAt.toISOString(),
        updatedAt: enrollment.user.updatedAt.toISOString(),
      },
      progress: enrollment.progress.map((p) => ({
        ...p,
        completedAt: p.completedAt?.toISOString() || null,
      })),
      quizAttempts: enrollment.quizAttempts.map((qa) => ({
        ...qa,
        attemptedAt: qa.attemptedAt.toISOString(),
      })),
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link
                href="/admin/bible-study"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to all courses
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {plainCourse.title}
                </span>
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                {plainCourse.description || "No description provided"}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/admin/bible-study/${params.courseId}/edit`}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Course
              </Link>
              <Link
                href={`/admin/bible-study/new?duplicate=${params.courseId}`}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Duplicate Course
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Lessons
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {totalLessons}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Enrollments
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {totalEnrollments}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completion Rate
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {completionRate}%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Course Duration
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">
                        {new Date(plainCourse.startDate).toLocaleDateString()} -{" "}
                        {new Date(plainCourse.endDate).toLocaleDateString()}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6">
              <CourseTabs course={plainCourse} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
