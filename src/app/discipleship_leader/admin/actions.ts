"use server";

import { RoleName } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminCourses() {
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

    return { data };
  } catch (e) {
    return { error: "An unexpected error occurred." };
  }
}
