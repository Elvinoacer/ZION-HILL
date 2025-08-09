import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const skip = (page - 1) * pageSize;

  try {
    const [ministries, totalMinistries] = await prisma.$transaction([
      prisma.ministry.findMany({
        skip: skip,
        take: pageSize,
        include: { leader: true },
      }),
      prisma.ministry.count(),
    ]);

    return NextResponse.json({ ministries, totalMinistries, page, pageSize });
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, leaderId } = await request.json();
    const newMinistry = await prisma.ministry.create({
      data: {
        name,
        description,
        leaderId,
      },
    });
    return NextResponse.json(newMinistry, { status: 201 });
  } catch (error) {
    console.error("Error creating ministry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, leaderId } = await request.json();
    const updatedMinistry = await prisma.ministry.update({
      where: { id },
      data: {
        name,
        description,
        leaderId,
      },
    });
    return NextResponse.json(updatedMinistry);
  } catch (error) {
    console.error("Error updating ministry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.ministry.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Ministry deleted successfully" });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}