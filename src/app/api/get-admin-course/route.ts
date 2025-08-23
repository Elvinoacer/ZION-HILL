"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user || !session.user.email) {
    //   return { error: "Unauthorized" };
    // }

    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    // });

    // if (!user || !user.roles.includes(RoleName.ADMIN)) {
    //   return { error: "Forbidden" };
    // }

    const courses = await prisma.bibleStudyCourse.findMany({
      orderBy: {
        startDate: "desc",
      },
      include: {
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
    });

    // Serialize the data to ensure it's plain
    const data = courses.map((course) => ({
      id: course.id,
      title: course.title,
      lessonsCount: course._count.lessons,
      enrollmentsCount: course._count.enrollments,
    }));

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({
      error:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    });
  }
}
