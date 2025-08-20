import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const liveStream = await prisma.liveStream.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(liveStream);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { streamUrl, isLive, platform, mediaType, viewerCount } = body;

    // Since we only want one livestream setting, we update the first one or create a new one.
    const existingLiveStream = await prisma.liveStream.findFirst();

    if (existingLiveStream) {
      const liveStream = await prisma.liveStream.update({
        where: { id: existingLiveStream.id },
        data: {
          streamUrl,
          isLive,
          platform,
          mediaType,
          viewerCount,
        },
      });
      return NextResponse.json(liveStream);
    } else {
      const liveStream = await prisma.liveStream.create({
        data: {
          streamUrl,
          isLive,
          platform,
          mediaType,
          viewerCount,
        },
      });
      return NextResponse.json(liveStream);
    }
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
