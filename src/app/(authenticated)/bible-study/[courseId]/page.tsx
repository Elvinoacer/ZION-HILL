import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import {
  BookOpenIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CalendarIcon,
  UsersIcon,
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
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
  });
  return course;
}

async function getEnrollment(courseId: string, userId: string) {
  if (!userId) return null;
  const enrollment = await prisma.bibleStudyEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      progress: true,
    },
  });
  return enrollment;
}

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);
  const course = await getCourse(params.courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
          <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Course Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The requested course could not be found.
          </p>
          <Link
            href="/bible-study"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Available Courses
          </Link>
        </div>
      </div>
    );
  }

  const userId = session?.user?.email
    ? (await prisma.user.findUnique({ where: { email: session.user.email } }))
        ?.id
    : undefined;

  const enrollment = userId
    ? await getEnrollment(params.courseId, userId)
    : null;
  const completedLessons = enrollment?.progress?.length || 0;
  const progressPercentage =
    course._count.lessons > 0
      ? Math.round((completedLessons / course._count.lessons) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    {new Date(course.startDate).toLocaleDateString()} -{" "}
                    {new Date(course.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500" />
                    {course._count.lessons}{" "}
                    {course._count.lessons === 1 ? "Lesson" : "Lessons"}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                    {course._count.enrollments}{" "}
                    {course._count.enrollments === 1 ? "Student" : "Students"}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                {!enrollment && userId && <EnrollButton courseId={course.id} />}
                {enrollment && (
                  <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-4 py-3 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Enrolled</span>
                  </div>
                )}
              </div>
            </div>

            {enrollment && (
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-700">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-blue-700">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {completedLessons} of {course._count.lessons} lessons
                  completed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-blue-500" />
            Course Lessons
          </h2>

          <div className="space-y-4">
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-6 rounded-xl shadow-sm transition-all duration-200 ${
                  enrollment
                    ? "bg-white hover:shadow-md border border-gray-100"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {enrollment ? (
                  <Link
                    href={`/bible-study/lesson/${lesson.id}`}
                    className="flex items-start"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                        {lesson.order}. {lesson.title}
                      </h3>
                      {enrollment.progress.some(
                        (p) => p.lessonId === lesson.id
                      ) && (
                        <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ) : (
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-500">
                        {lesson.order}. {lesson.title}
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <LockClosedIcon className="h-4 w-4 mr-1" />
                        Enroll to view lesson
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
