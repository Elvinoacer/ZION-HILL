import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    const course = await prisma.bibleStudyCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const body = await request.json();

    const { title, description, certificateFrequency, startDate, endDate } = body;

    // Basic validation (you might want more robust validation)
    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.bibleStudyCourse.update({
      where: { id: courseId },
      data: {
        title,
        description,
        certificateFrequency,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
