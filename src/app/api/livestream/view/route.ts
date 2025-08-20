import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const liveStream = await prisma.liveStream.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (liveStream) {
      const updatedLiveStream = await prisma.liveStream.update({
        where: { id: liveStream.id },
        data: {
          viewerCount: {
            increment: 1,
          },
        },
      });
      return NextResponse.json(updatedLiveStream);
    } else {
      return new NextResponse("Livestream not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error incrementing viewer count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
