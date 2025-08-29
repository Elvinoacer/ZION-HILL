import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { title, content, tags, ministryId } = await req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        tags,
        ministryId, // Include ministryId in the creation
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
    const { searchParams } = new URL(req.url);
    const ministryId = searchParams.get("ministryId");

    const announcements = await prisma.announcement.findMany({
      where: ministryId ? { ministryId } : { ministryId: null }, // Filter by ministryId or where it's null
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