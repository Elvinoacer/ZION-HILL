
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
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

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    const { courseId } = params;

    // Check if already enrolled
    const existingEnrollment = await prisma.bibleStudyEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return new NextResponse("Already enrolled", { status: 409 });
    }

    const newEnrollment = await prisma.bibleStudyEnrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
    });

    return NextResponse.json(newEnrollment, { status: 201 });
  } catch (error) {
    console.error("[BIBLE_STUDY_ENROLL_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
