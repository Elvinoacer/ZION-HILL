
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.roles.includes(RoleName.ADMIN)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { courseId } = params;
    const course = await prisma.bibleStudyCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[ADMIN_BIBLE_STUDY_COURSE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
