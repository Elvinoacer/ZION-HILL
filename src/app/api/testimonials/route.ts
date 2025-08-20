import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  try {
    const skip = (page - 1) * pageSize;

    const [testimonials, totalTestimonials] = await prisma.$transaction([
      prisma.feedback.findMany({
        where: { tags: { has: "testimonial" } },
        include: { user: true },
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.feedback.count({ where: { tags: { has: "testimonial" } } }),
    ]);

    return NextResponse.json({ testimonials, totalTestimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: `Error fetching testimonials: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Received POST request body:", body);
  const { comment, imageUrl, sentiment, userId, tags } = body;
  try {
    const newTestimonial = await prisma.feedback.create({
      data: {
        comment,
        imageUrl,
        sentiment,
        userId,
        tags: [...(tags || []), "testimonial"],
      },
    });
    console.log("Created new testimonial:", newTestimonial);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: `Error creating testimonial: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Testimonial ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonial = await prisma.feedback.findUnique({ where: { id } });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.roles?.includes("Admin");
    const isOwner = testimonial.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not own this testimonial or lack admin privileges",
        },
        { status: 403 }
      );
    }

    const updatedTestimonial = await prisma.feedback.update({
      where: { id },
      data: { ...body, tags: [...(body.tags || []), "testimonial"] },
    });
    return NextResponse.json(updatedTestimonial);
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: `Error updating testimonial: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Testimonial ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonial = await prisma.feedback.findUnique({ where: { id } });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.roles?.includes("Admin");
    const isOwner = testimonial.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not own this testimonial or lack admin privileges",
        },
        { status: 403 }
      );
    }

    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: `Error deleting testimonial: ${error.message}` },
      { status: 500 }
    );
  }
}
