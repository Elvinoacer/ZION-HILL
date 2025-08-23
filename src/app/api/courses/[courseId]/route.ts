import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await prisma.bibleStudyCourse.findUnique({
      where: { id: params.courseId },
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

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Convert Date objects to ISO strings for serialization
    const serializedCourse = {
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

    return NextResponse.json(serializedCourse);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
