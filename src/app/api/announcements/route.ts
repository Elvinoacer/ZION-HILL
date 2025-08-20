import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { title, content, tags } = await req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        tags,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
