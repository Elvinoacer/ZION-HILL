import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Assuming authOptions are defined here

export async function GET(request: Request) {
  try {
    const devotionals = await prisma.asset.findMany({
      where: { type: "RESOURCE", tags: { has: "devotional" } },
    });
    return NextResponse.json(devotionals);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching devotionals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = body; // Destructure content directly

    if (!title || !content) { // Validate title and content
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newDevotional = await prisma.asset.create({ data: { title, content, type: 'RESOURCE', tags: [...(body.tags || []), 'devotional'], uploaderId: session.user.id } });
    return NextResponse.json(newDevotional, { status: 201 });
  } catch (error) {
    console.error('Error creating devotional:', error);
    return NextResponse.json({ error: 'Error creating devotional' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Devotional ID is required' }, { status: 400 });
  }

  try {
    const { title, content } = body; // Destructure content directly

    if (!title || !content) { // Validate title and content
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedDevotional = await prisma.asset.update({
      where: { id },
      data: { title, content, type: 'RESOURCE', tags: [...(body.tags || []), 'devotional'], uploaderId: session.user.id },
    });
    return NextResponse.json(updatedDevotional);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating devotional" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Devotional ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ message: "Devotional deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting devotional" },
      { status: 500 }
    );
  }
}
