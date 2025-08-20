import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const counselingSessions = await prisma.counselingSession.findMany();
    return NextResponse.json(counselingSessions);
  } catch (error) {
    console.error("Error fetching counseling sessions:", error);
    return NextResponse.json({ error: "Error fetching counseling sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newCounselingSession = await prisma.counselingSession.create({ data: body });
    return NextResponse.json(newCounselingSession, { status: 201 });
  } catch (error) {
    console.error("Error creating counseling session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating counseling session" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Counseling Session ID is required" }, { status: 400 });
  }

  try {
    const updatedCounselingSession = await prisma.counselingSession.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedCounselingSession);
  } catch (error) {
    console.error("Error updating counseling session:", error);
    return NextResponse.json({ error: "Error updating counseling session" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Counseling Session ID is required" }, { status: 400 });
  }

  try {
    await prisma.counselingSession.delete({ where: { id } });
    return NextResponse.json({ message: "Counseling Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting counseling session:", error);
    return NextResponse.json({ error: "Error deleting counseling session" }, { status: 500 });
  }
}
