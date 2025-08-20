
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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
    const enrollments = await prisma.bibleStudyEnrollment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        course: {
          include: {
            lessons: true, // to get total number of lessons
          },
        },
        progress: true, // to get completed lessons
      },
    });

    // Calculate progress percentage for each enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress.filter(
        (p) => p.completedAt
      ).length;
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      return {
        ...enrollment,
        progressPercentage,
      };
    });

    return NextResponse.json(enrollmentsWithProgress);
  } catch (error) {
    console.error("[BIBLE_STUDY_MY_PROGRESS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
