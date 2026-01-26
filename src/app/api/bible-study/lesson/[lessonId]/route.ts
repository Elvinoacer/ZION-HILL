import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { lessonId } = params;

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        questions: true, // Include questions for the lesson
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[BIBLE_STUDY_LESSON_GET_SINGLE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
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

  // if (!user || !user.roles.includes(RoleName.ADMIN)) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  try {
    const { lessonId } = params;
    const body = await req.json();

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: body,
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("[BIBLE_STUDY_LESSON_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

  if (!user || !user.roles.includes(RoleName.ADMIN)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { lessonId } = params;

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return new NextResponse("Lesson deleted", { status: 200 });
  } catch (error) {
    console.error("[BIBLE_STUDY_LESSON_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
