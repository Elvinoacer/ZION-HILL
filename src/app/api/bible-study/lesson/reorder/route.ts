
import { NextResponse } from "next/server";
import { PrismaClient, RoleName } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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
    const body = await req.json();
    const { lessons } = body; // Expects an array of { id: string, order: number }

    if (!lessons || !Array.isArray(lessons)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const updates = lessons.map(lesson => 
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { order: lesson.order },
      })
    );

    await prisma.$transaction(updates);

    return new NextResponse("Lessons reordered successfully", { status: 200 });
  } catch (error) {
    console.error("[BIBLE_STUDY_REORDER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
