import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  try {
    switch (type) {
      case "upcoming-services":
        const upcomingServices = await prisma.event.findMany({
          where: { type: "SERVICE", date: { gte: new Date() } },
        });
        return NextResponse.json(upcomingServices);
      case "team-members":
        const teamMembers = await prisma.user.findMany({
          where: { roles: { some: { name: "WORSHIP_LEADER" } } },
        });
        return NextResponse.json(teamMembers);
      case "recent-songs":
        const recentSongs = await prisma.asset.findMany({
          where: { type: "AUDIO" },
        });
        return NextResponse.json(recentSongs);
      case "analytics":
        // This is a placeholder. You'll need to define how to calculate worship analytics.
        return NextResponse.json({});
      case "song-proposals":
        // This is a placeholder. You'll need to define how to model song proposals.
        return NextResponse.json([]);
      default:
        return NextResponse.json(
          { error: "Invalid data type" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    // Placeholder for POST requests, as the page primarily fetches data
    return NextResponse.json({ message: "Action performed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error performing action" },
      { status: 500 }
    );
  }
}
