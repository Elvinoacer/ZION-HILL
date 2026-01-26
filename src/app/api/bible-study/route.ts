import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bibleStudyCourses = await prisma.bibleStudyCourse.findMany({
      // Later, we can add logic to fetch specific courses, e.g., for a user
    });
    return NextResponse.json(bibleStudyCourses);
  } catch (error) {
    console.error('Error fetching bible study:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
