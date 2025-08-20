import { PrismaClient } from "@/generated/prisma";
import Link from "next/link";
import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const prisma = new PrismaClient();

async function getCourses() {
  const courses = await prisma.bibleStudyCourse.findMany({
    orderBy: {
      startDate: "desc",
    },
    include: {
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
  });
  return courses;
}

export default async function BibleStudyPage() {
  const courses = await getCourses();
  const now = new Date();

  const activeCourses = courses.filter(
    (course) => new Date(course.endDate) >= now
  );
  const pastCourses = courses.filter(
    (course) => new Date(course.endDate) < now
  );

  const CourseCard = ({ course, isActive }) => {
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const durationInWeeks = Math.ceil(
      (endDate - startDate) / (7 * 24 * 60 * 60 * 1000)
    );

    return (
      <Link href={`/bible-study/${course.id}`} key={course.id}>
        <div
          className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col ${
            isActive
              ? "border-t-4 border-blue-500"
              : "border-t-4 border-gray-300"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
          <div className="relative flex flex-col h-full p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                {course.title}
              </h2>
              {isActive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {course.description ||
                "Explore this Bible study course to deepen your faith."}
            </p>

            <div className="space-y-3 mt-auto">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="flex-shrink-0 h-4 w-4 mr-2" />
                {startDate.toLocaleDateString()} –{" "}
                {endDate.toLocaleDateString()}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  {course._count.lessons}{" "}
                  {course._count.lessons === 1 ? "Lesson" : "Lessons"}
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  {durationInWeeks} {durationInWeeks === 1 ? "Week" : "Weeks"}
                </div>
                <div className="flex items-center text-gray-600">
                  <TrophyIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  Certificate
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {course._count.enrollments} Enrolled
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bible Study Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Grow in faith through our structured Bible study programs
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Active Courses
            </h2>
            {activeCourses.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {activeCourses.length} Available
              </span>
            )}
          </div>

          {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCourses.map((course) => (
                <CourseCard course={course} isActive={true} key={course.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No active courses right now
              </h3>
              <p className="mt-1 text-gray-500">
                Check back soon for new Bible study opportunities.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse other resources
                </Link>
              </div>
            </div>
          )}
        </section>

        {pastCourses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-3 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Past Courses
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {pastCourses.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastCourses.map((course) => (
                <CourseCard course={course} isActive={false} key={course.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
