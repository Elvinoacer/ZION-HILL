import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10, // Limit results for efficiency
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Error searching users" }, { status: 500 });
  }
}