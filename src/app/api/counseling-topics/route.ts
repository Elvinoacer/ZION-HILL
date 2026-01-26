import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

// GET all counseling topics
export async function GET() {
  try {
    const topics = await prisma.counselingTopic.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching counseling topics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST a new counseling topic (Admin only)
export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || !session.user.roles.includes("ADMIN")) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim() === "") {
      return new NextResponse("Topic name is required.", { status: 400 });
    }

    const newTopic = await prisma.counselingTopic.create({
      data: {
        name,
      },
    });
    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error("Error creating counseling topic:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT (update) a counseling topic (Admin only)
export async function PUT(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || !session.user.roles.includes("ADMIN")) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { id, name } = await request.json();
    if (
      !id ||
      typeof id !== "string" ||
      !name ||
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return new NextResponse("Topic ID and name are required.", {
        status: 400,
      });
    }

    const updatedTopic = await prisma.counselingTopic.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating counseling topic:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE a counseling topic (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.roles.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return new NextResponse("Topic ID is required.", { status: 400 });
    }

    await prisma.counselingTopic.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting counseling topic:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
