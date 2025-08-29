import { PrismaClient } from "@/generated/prisma";
import Link from "next/link";
import {
  ArchiveBoxIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, UsersIcon } from "lucide-react";

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
      (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    return (
      <Link href={`/member/bible-study/${course.id}`} key={course.id}>
        <div
          className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-white`}
        >
          <div
            className={`h-2 ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
          ></div>
          <div className="relative flex flex-col h-full p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                {course.title}
              </h2>
              {isActive && (
                <span className="flex-shrink-0 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
              {course.description ||
                "Explore this Bible study course to deepen your faith."}
            </p>

            <div className="space-y-3 mt-auto text-sm">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="flex-shrink-0 h-4 w-4 mr-2" />
                <span>
                  {startDate.toLocaleDateString()} –{" "}
                  {endDate.toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    {course._count.lessons}{" "}
                    {course._count.lessons === 1 ? "Lesson" : "Lessons"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    {durationInWeeks} {durationInWeeks === 1 ? "Week" : "Weeks"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TrophyIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Certificate</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{course._count.enrollments} Enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Bible Study Courses
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Grow in faith through our structured Bible study programs.
          </p>
        </div>

        <section className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <CheckCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-blue-600" />
              Active Courses
            </h2>
            {activeCourses.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {activeCourses.length} Available
              </span>
            )}
          </div>

          {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activeCourses.map((course) => (
                <CourseCard course={course} isActive={true} key={course.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-md border border-gray-200">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No active courses right now
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back soon for new Bible study opportunities.
              </p>
              <div className="mt-6">
                <Link
                  href="/member/resources"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Other Resources
                </Link>
              </div>
            </div>
          )}
        </section>

        {pastCourses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <ArchiveBoxIcon className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-indigo-600" />
                Past Courses
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {pastCourses.length} Archived
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
