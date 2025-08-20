import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const theme = await prisma.themeOfTheWeek.findUnique({
        where: { id },
      });
      if (!theme) {
        return NextResponse.json({ message: "Theme not found" }, { status: 404 });
      }
      return NextResponse.json(theme);
    } else {
      const themes = await prisma.themeOfTheWeek.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(themes);
    }
  } catch (error) {
    console.error("Error fetching theme of the week(s):", error);
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

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { title, verse, reference } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Theme ID is required" }, { status: 400 });
  }

  try {
    const updatedTheme = await prisma.themeOfTheWeek.update({
      where: { id },
      data: {
        title,
        verse,
        reference,
      },
    });
    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error("Error updating theme of the week:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: "Theme ID is required" }, { status: 400 });
  }

  try {
    await prisma.themeOfTheWeek.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error) {
    console.error("Error deleting theme of the week:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}