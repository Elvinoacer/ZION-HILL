import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, RoleName } from "@/generated/prisma";
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

  // TODO: Uncomment this when you want to enforce admin role

  // if (!user || !user.roles.includes(RoleName.ADMIN)) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  try {
    const body = await req.json();
    const { title, description, certificateFrequency, startDate, endDate } =
      body;

    if (!title || !certificateFrequency || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newCourse = await prisma.bibleStudyCourse.create({
      data: {
        title,
        description,
        certificateFrequency,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        adminId: user.id,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("[BIBLE_STUDY_COURSE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
