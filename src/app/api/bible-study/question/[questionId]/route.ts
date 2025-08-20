
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { questionId: string } }
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
    const { questionId } = params;
    const body = await req.json();

    const updatedQuestion = await prisma.lessonQuestion.update({
      where: {
        id: questionId,
      },
      data: body,
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("[BIBLE_STUDY_QUESTION_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { questionId: string } }
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
    const { questionId } = params;

    await prisma.lessonQuestion.delete({
      where: {
        id: questionId,
      },
    });

    return new NextResponse("Question deleted", { status: 200 });
  } catch (error) {
    console.error("[BIBLE_STUDY_QUESTION_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
