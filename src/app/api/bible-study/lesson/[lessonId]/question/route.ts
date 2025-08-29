import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
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

  // if (!user || !user.roles.includes(RoleName.ADMIN)) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  try {
    const { lessonId } = params;
    const body = await req.json();
    const { text, options, correctAnswerIndex } = body;

    if (!text || !options || correctAnswerIndex === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newQuestion = await prisma.lessonQuestion.create({
      data: {
        text,
        options,
        correctAnswerIndex,
        lessonId,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("[BIBLE_STUDY_QUESTION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Optional: Add role-based authorization if needed
  // const user = await prisma.user.findUnique({
  //   where: { email: session.user.email },
  // });
  // if (!user || !user.roles.includes(RoleName.ADMIN)) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  try {
    const { lessonId } = await params; // MODIFIED LINE HERE

    const questions = await prisma.lessonQuestion.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        createdAt: "asc", // Order questions by creation time
      },
    });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("[BIBLE_STUDY_QUESTION_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}