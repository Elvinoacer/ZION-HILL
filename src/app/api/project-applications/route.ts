import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions} from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicantId = searchParams.get('applicantId');
  const projectId = searchParams.get('projectId');

  if (!applicantId && !projectId) {
    return NextResponse.json({ error: 'Either applicantId or projectId is required' }, { status: 400 });
  }

  try {
    const applications = await prisma.projectApplication.findMany({
      where: {
        ...(applicantId && { applicantId }),
        ...(projectId && { projectId }),
      },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching project applications:', error);
    return NextResponse.json({ error: 'Error fetching project applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { projectId, applicantId, notes } = body;

  if (!projectId || !applicantId) {
    return NextResponse.json({ error: 'Project ID and Applicant ID are required' }, { status: 400 });
  }

  try {
    // Check if the user has already applied to this project
    const existingApplication = await prisma.projectApplication.findUnique({
      where: {
        projectId_applicantId: {
          projectId,
          applicantId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this project' }, { status: 409 });
    }

    const newApplication = await prisma.projectApplication.create({
      data: {
        projectId,
        applicantId,
        notes,
        status: 'PENDING', // Default status
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating project application:', error);
    return NextResponse.json({ error: 'Error creating project application' }, { status: 500 });
  }
}
