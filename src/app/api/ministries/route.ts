import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const ministry = await prisma.ministry.findUnique({
        where: { id },
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true, // Assuming email might be useful
              photo: true,
            },
          },
          members: {
            select: {
              userId: true, // Select only userId from MinistryMember
              active: true, // Assuming you want to include active status
              joinDate: true, // Assuming you want to include join date
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true, // Assuming email might be useful
                  photo: true, // Assuming you want to include user photo
                },
              },
            },
          },
          groups: {
            select: { id: true }, // Only need ID for counting
          },
          events: {
            where: {
              date: {
                gte: new Date(), // Only upcoming events
              },
            },
          },
        },
      });
      if (!ministry) {
        return NextResponse.json(
          { error: "Ministry not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(ministry);
    }
    const ministries = await prisma.ministry.findMany({
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true, // Add photo field
          },
        },
        members: {
          select: {
            userId: true,
            role: true,
            active: true,
            joinDate: true,
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
        },
        groups: {
          // Include groups
          select: { id: true }, // Only need ID for counting
        },
        events: {
          // Include events
          where: {
            date: {
              gte: new Date(), // Only upcoming events
            },
          },
          select: { id: true }, // Only need ID for counting
        },
      },
    });
    return NextResponse.json(ministries);
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Basic authorization: Only Admin or specific roles can create ministries
  const isAdmin = session.user.roles?.includes("Admin");
  // You might want to add other roles like 'Overall Ministries Coordinator'
  // if (!isAdmin) {
  //   return NextResponse.json(
  //     { error: "Forbidden: You do not have permission to create ministries" },
  //     { status: 403 }
  //   );
  // }

  const body = await request.json();
  const { name, description, leaderId, photo } = body;

  if (!name || !leaderId) {
    return NextResponse.json(
      { error: "Name and leaderId are required" },
      { status: 400 }
    );
  }

  try {
    const newMinistry = await prisma.ministry.create({
      data: {
        name,
        description,
        leaderId,
        photo,
      },
    });
    return NextResponse.json(newMinistry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ministry:", error.message);
    return NextResponse.json(
      { error: "Failed to create ministry" },
      { status: 500 }
    );
  }
}
