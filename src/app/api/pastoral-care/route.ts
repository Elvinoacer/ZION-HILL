import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoleName } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "sessions":
        const sessions = await prisma.counselingSession.findMany();
        return NextResponse.json(sessions);
      case "therapists":
        const therapists = await prisma.user.findMany({
          where: {
            roles: { has: RoleName.COUNSELOR },
          },
        });
        return NextResponse.json(therapists);
      case "counselor-sessions":
        const counselorId = searchParams.get("counselorId");
        if (!counselorId) {
          return NextResponse.json({ message: "Counselor ID is required" }, { status: 400 });
        }
        const counselorSessions = await prisma.counselingSession.findMany({
          where: {
            counselorId: counselorId,
          },
          include: {
            client: {
              select: {
                name: true,
                email: true,
              },
            },
            topic: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        });
        return NextResponse.json(counselorSessions);
      case "groups":
        const groups = await prisma.group.findMany();
        return NextResponse.json(groups);
      default:
        return NextResponse.json(
          { message: "Invalid or missing type parameter" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error fetching pastoral care data:", error);
    return NextResponse.json(
      { error: "Error fetching data", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const body = await request.json();

  try {
    switch (type) {
      case "book-session":
        const newSession = await prisma.counselingSession.create({
          data: {
            clientId: body.clientId,
            counselorId: body.counselorId,
            date: new Date(body.date),
            status: body.status || "Scheduled",
            progress: body.progress || 0,
            notes: body.notes || "",
          },
        });
        return NextResponse.json(newSession);
      default:
        return NextResponse.json(
          { message: "Invalid or missing type parameter for POST" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error processing pastoral care POST request:", error);
    return NextResponse.json(
      { error: "Error creating data", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return NextResponse.json({ message: "PUT not implemented" }, { status: 501 });
}

export async function DELETE(request: Request) {
  return NextResponse.json(
    { message: "DELETE not implemented" },
    { status: 501 }
  );
}
