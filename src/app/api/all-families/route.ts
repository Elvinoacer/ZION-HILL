import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { RoleName } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.roles?.includes(RoleName.ADMIN);

  try {
    const families = await prisma.family.findMany({
      include: {
        members: { 
            select: { 
                id: true, 
                name: true, 
                photo: true,
                email: isAdmin, // Explicitly use boolean to fetch email only for admins
            } 
        },
        createdBy: { 
            select: { 
                id: true, 
                name: true, 
                createdAt: true 
            } 
        },
      },
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error("Error fetching all families:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
