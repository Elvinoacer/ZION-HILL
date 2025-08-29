
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    const { lessonId } = params;
    const body = await req.json();
    const { answers } = body; // Expects answers in format { [questionId]: selectedOptionIndex }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { questions: true, course: true },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    lesson.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });
    const score = lesson.questions.length > 0 ? (correctAnswers / lesson.questions.length) * 100 : 100;

    // Get enrollment
    const enrollment = await prisma.bibleStudyEnrollment.findFirst({
      where: {
        userId: user.id,
        courseId: lesson.courseId,
      },
    });

    if (!enrollment) {
      return new NextResponse("Not enrolled in this course", { status: 403 });
    }

    // Create quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
        score: score,
        summary: answers,
      },
    });

    // Update lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
        completedAt: new Date(),
      },
    });

    // Check for course completion and generate certificate
    const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completedAt: { not: null },
      },
    });

    if (totalLessons === completedLessons) {
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          userId: user.id,
          courseId: lesson.courseId,
        },
      });

      if (!existingCertificate) {
        await prisma.certificate.create({
          data: {
            userId: user.id,
            courseId: lesson.courseId,
            recipientName: user.name,
            briefDescription: `For the successful completion of the course: ${lesson.course.title}`,
            cloudinaryUrl: "", // Placeholder, will be generated on download
            certificateType: "Course Completion", // Added certificateType
          },
        });
      }
    }

    return NextResponse.json(quizAttempt, { status: 201 });
  } catch (error) {
    console.error("[BIBLE_STUDY_SUBMIT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
