
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: user.id,
        courseId: {
          not: null,
        },
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("[BIBLE_STUDY_MY_CERTIFICATES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
