import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);

  // Ensure the user is authenticated and can only access their own data
  if (!session || session.user.id !== params.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const enrollments = await prisma.bibleStudyEnrollment.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        progress: true, // To count completed lessons
        course: {
          include: {
            _count: {
              select: { lessons: true }, // To get total lesson count
            },
          },
        },
      },
    });

    // Calculate the progress percentage for each enrolled course
    const enrollmentsWithProgress = enrollments.map(enrollment => {
      const totalLessons = enrollment.course._count.lessons;
      const completedLessons = enrollment.progress.filter(p => p.completedAt).length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        ...enrollment,
        progressPercentage,
      };
    });

    return NextResponse.json(enrollmentsWithProgress);
  } catch (error) {
    console.error(`Error fetching enrollments for user ${params.userId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
