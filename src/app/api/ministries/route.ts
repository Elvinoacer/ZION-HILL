import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { RoleName } from "@prisma/client";

// Helper to check for Administrative / Coordinator roles
async function isAdminOrCoordinator(session: any) {
  if (!session?.user?.roles) return false;
  const roles = session.user.roles;
  return roles.includes(RoleName.ADMIN) || 
         roles.includes(RoleName.SENIOR_PASTOR) || 
         roles.includes(RoleName.OVERALL_MINISTRIES_COORDINATOR);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single ministry by ID with detailed includes
      const ministry = await prisma.ministry.findUnique({
        where: { id },
        include: {
          leader: {
            select: { id: true, name: true, email: true, photo: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true, photo: true },
              },
            },
          },
          groups: true,
          events: {
            where: {
              date: { gte: new Date() }, // Only upcoming events
            },
          },
        },
      });

      if (!ministry) {
        return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
      }
      return NextResponse.json(ministry);
    } else {
      // Fetch a paginated list of ministries
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      const skip = (page - 1) * pageSize;

      const [ministries, totalMinistries] = await prisma.$transaction([
        prisma.ministry.findMany({
          include: {
            leader: { select: { id: true, name: true, photo: true } },
            _count: { select: { members: true, groups: true, events: true } },
          },
          skip,
          take: pageSize,
          orderBy: { name: 'asc' }
        }),
        prisma.ministry.count(),
      ]);

      return NextResponse.json({ ministries, totalMinistries, page, pageSize });
    }
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isAdminOrCoordinator(session))) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, leaderId, photo } = body;

    if (!name || !leaderId) {
      return NextResponse.json({ error: "Name and leaderId are required" }, { status: 400 });
    }

    const newMinistry = await prisma.ministry.create({
      data: { name, description, leaderId, photo },
    });

    return NextResponse.json(newMinistry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ministry:", error);
    return NextResponse.json({ error: "Failed to create ministry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isAdminOrCoordinator(session))) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const { id, name, description, leaderId, photo } = await request.json();
    if (!id) {
        return NextResponse.json({ error: "Ministry ID is required for updates" }, { status: 400 });
    }

    const updatedMinistry = await prisma.ministry.update({
      where: { id },
      data: { name, description, leaderId, photo },
    });

    return NextResponse.json(updatedMinistry);
  } catch (error) {
    console.error("Error updating ministry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(await isAdminOrCoordinator(session))) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ministry ID" }, { status: 400 });
    }

    // Use transaction for manual cascade (if not handled by DB schema)
    await prisma.$transaction(async (tx) => {
      // Cleanup events related to this ministry specifically
      // This is a safety measure if schema cascade isn't fully set
      await tx.event.deleteMany({ where: { ministryId: id } });
      await tx.ministryMember.deleteMany({ where: { ministryId: id } });
      await tx.ministry.delete({ where: { id } });
    });

    return NextResponse.json({ message: "Ministry deleted successfully" });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
