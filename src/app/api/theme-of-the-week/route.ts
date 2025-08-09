import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const theme = await prisma.themeOfTheWeek.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!theme) {
      return NextResponse.json(
        { message: "No theme of the week found" },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error fetching theme of the week:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, verse, reference } = await request.json();

    if (!title || !verse || !reference) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTheme = await prisma.themeOfTheWeek.create({
      data: {
        title,
        verse,
        reference,
      },
    });

    return NextResponse.json(newTheme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme of the week:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
