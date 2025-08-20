import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const outreachPrograms = await prisma.event.findMany({ where: { type: "EVENT" } });
    return NextResponse.json(outreachPrograms);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching outreach programs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    console.log(body);
    const newOutreachProgram = await prisma.event.create({
      data: {
        ...body,
        type: "EVENT", // Ensure it's an outreach program
      },
    });
    return NextResponse.json(newOutreachProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating outreach program" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Outreach Program ID is required" }, { status: 400 });
  }

  try {
    const updatedOutreachProgram = await prisma.event.update({
      where: { id },
      data: { ...body, type: "EVENT" }, // Ensure type remains 'EVENT'
    });
    return NextResponse.json(updatedOutreachProgram);
  } catch (error) {
    return NextResponse.json({ error: "Error updating outreach program" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Outreach Program ID is required" }, { status: 400 });
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Outreach Program deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting outreach program" }, { status: 500 });
  }
}
