import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

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

  //TODO: Uncomment this when you want to enforce admin role
  // if (!user || !user.roles.includes(RoleName.ADMIN)) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  try {
    const { courseId } = params;
    const body = await req.json();
    const { title, order, pdfUrl, imageUrl, externalLink, content } = body;

    if (!title || !order) {
      return new NextResponse("Missing required fields: title and order", {
        status: 400,
      });
    }

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        order,
        pdfUrl,
        imageUrl,
        externalLink,
        content,
        courseId,
      },
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error("[BIBLE_STUDY_LESSON_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { courseId } = params;

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("[BIBLE_STUDY_LESSON_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
