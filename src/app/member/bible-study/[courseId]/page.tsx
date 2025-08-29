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
            href="/member/bible-study"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-md sm:text-lg text-gray-600 mb-4">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <span>
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <span>
                      {course._count.lessons}{" "}
                      {course._count.lessons === 1 ? "Lesson" : "Lessons"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <span>
                      {course._count.enrollments}{" "}
                      {course._count.enrollments === 1
                        ? "Student"
                        : "Students"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto">
                {!enrollment && userId && (
                  <EnrollButton courseId={course.id} />
                )}
                {enrollment && (
                  <div className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 px-4 py-3 rounded-lg font-medium">
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
                    Your Progress
                  </span>
                  <span className="text-sm font-medium text-blue-700">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
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
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-3 text-blue-500" />
            Course Content
          </h2>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`rounded-lg transition-all duration-200 ${
                  enrollment
                    ? "bg-white shadow-sm hover:shadow-md border border-gray-200"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                {enrollment ? (
                  <Link
                    href={`/member/bible-study/lesson/${lesson.id}`}
                    className="flex items-center justify-between p-4 sm:p-5"
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                          enrollment.progress.some(
                            (p) => p.lessonId === lesson.id
                          )
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {enrollment.progress.some(
                          (p) => p.lessonId === lesson.id
                        ) ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-md sm:text-lg font-semibold text-gray-800 hover:text-blue-600">
                          {lesson.title}
                        </h3>
                        {enrollment.progress.some(
                          (p) => p.lessonId === lesson.id
                        ) && (
                          <span className="hidden sm:inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors"
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
                  <div className="flex items-center p-4 sm:p-5">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-500">
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md sm:text-lg font-semibold text-gray-500">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Enroll to unlock
                      </p>
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
