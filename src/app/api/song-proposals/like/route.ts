import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Song proposal ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the user has already liked this song proposal
    const existingLike = await prisma.songLike.findUnique({
      where: {
        userId_songProposalId: {
          userId: session.user.id,
          songProposalId: id,
        },
      },
    });

    if (existingLike) {
      // User has already liked this song, so unlike it
      await prisma.songLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const updatedProposal = await prisma.songProposal.update({
        where: { id },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      return NextResponse.json({ message: "Song unliked successfully", proposal: updatedProposal });
    } else {
      // User has not liked this song, so like it
      await prisma.songLike.create({
        data: {
          userId: session.user.id,
          songProposalId: id,
        },
      });

      const updatedProposal = await prisma.songProposal.update({
        where: { id },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
      return NextResponse.json({ message: "Song liked successfully", proposal: updatedProposal });
    }
  } catch (error: any) {
    console.error("Error processing like/unlike:", error.message);
    return NextResponse.json(
      { error: "Failed to process like/unlike" },
      { status: 500 }
    );
  }
}
