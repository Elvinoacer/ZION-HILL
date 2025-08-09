import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/polls - Fetch all polls
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            votes: true, // Include votes to count them
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pollsWithVoteCounts = polls.map((poll) => ({
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        _count: {
          votes: option.votes.length,
        },
      })),
    }));

    return NextResponse.json(pollsWithVoteCounts);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { message: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

// POST /api/polls - Create a new poll or submit a vote
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { type, pollId, optionId, title, description, options } =
    await req.json();

  if (type === "CREATE_POLL") {
    // Admin-only: Create a new poll
    // TODO: Implement role-based authorization for admin (e.g., check if user has 'ADMIN' role)
    // For now, any logged-in user can create a poll.
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { message: "Invalid poll data" },
        { status: 400 }
      );
    }

    try {
      const newPoll = await prisma.poll.create({
        data: {
          title,
          description,
          createdById: session.user.id,
          options: {
            create: options.map((opt: string) => ({ text: opt })),
          },
        },
        include: {
          options: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return NextResponse.json(newPoll, { status: 201 });
    } catch (error: any) {
      console.error("Error creating poll:", error.message, error.stack);
      return NextResponse.json(
        { message: "Failed to create poll", error: error.message },
        { status: 500 }
      );
    }
  } else if (type === "SUBMIT_VOTE") {
    // User: Submit a vote
    if (!pollId || !optionId) {
      return NextResponse.json(
        { message: "Invalid vote data" },
        { status: 400 }
      );
    }

    try {
      // Check if user has already voted in this poll
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_pollId: {
            userId: session.user.id,
            pollId: pollId,
          },
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { message: "You have already voted in this poll" },
          { status: 409 }
        );
      }

      const newVote = await prisma.vote.create({
        data: {
          userId: session.user.id,
          pollId: pollId,
          optionId: optionId,
        },
      });

      // Optionally, update poll option vote count directly if needed for immediate consistency
      // This is more for server-side aggregation, optimistic update will handle frontend
      // await prisma.pollOption.update({
      //   where: { id: optionId },
      //   data: { votes: { increment: 1 } },
      // });

      return NextResponse.json(newVote, { status: 201 });
    } catch (error) {
      console.error("Error submitting vote:", error);
      return NextResponse.json(
        { message: "Failed to submit vote" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Invalid request type" },
      { status: 400 }
    );
  }
}
