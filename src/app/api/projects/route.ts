import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  const skip = (page - 1) * limit;

  try {
    const [projectsFromDb, totalProjects] = await prisma.$transaction([
      prisma.event.findMany({
        where: { type: 'EVENT', tags: { has: 'project' } },
        include: {
          financials: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.event.count({ where: { type: 'EVENT', tags: { has: 'project' } } }),
    ]);

    const projects = projectsFromDb.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      imageUrl: p.imageUrl,
      fundraisingGoal: p.financials?.budget || 0,
      fundraisingProgress: p.financials?.revenue || 0,
      goal: p.financials?.budget || 0,
      progress: p.financials?.revenue || 0,
    }));

    return NextResponse.json({
      data: projects,
      pagination: {
        total: totalProjects,
        totalPages: Math.ceil(totalProjects / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  console.log("Request Body:", body);
  try {
    const { fundraisingGoal, ...eventData } = body;
    console.log('fundraisingGoal in POST', fundraisingGoal);
    const newProject = await prisma.event.create({
      data: {
        ...eventData,
        type: "EVENT",
        tags: [...(body.tags || []), "project"],
        financials: {
          create: {
            budget: parseFloat(fundraisingGoal),
            expenses: 0,
            revenue: 0,
            vendorPayments: {},
          },
        },
      },
    });

    // Create a Donation Plan for the project
    await prisma.donationPlan.create({
      data: {
        name: newProject.title,
        description: newProject.description,
        goalAmount: fundraisingGoal,
        type: "PROJECT",
        imageUrl: newProject.imageUrl,
      },
    });

    // Create a Volunteering Opportunity for the project
    await prisma.volunteeringOpportunity.create({
      data: {
        title: `Volunteer for ${newProject.title}`,
        description: newProject.description,
        type: "PROJECT",
        imageUrl: newProject.imageUrl,
        coordinatorId: session.user.id,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();
  console.log("Request Body:", body);

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    const { fundraisingGoal, ...eventData } = body;
    const updatedProject = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        type: "EVENT",
        tags: [...(body.tags || []), "project"],
        financials: {
          update: {
            budget: parseFloat(fundraisingGoal),
          },
        },
      },
    });

    // Update the associated Donation Plan
    const donationPlan = await prisma.donationPlan.findFirst({
      where: { name: updatedProject.title, type: "PROJECT" },
    });
    if (donationPlan) {
      await prisma.donationPlan.update({
        where: { id: donationPlan.id },
        data: {
          name: updatedProject.title,
          description: updatedProject.description,
          goalAmount: fundraisingGoal,
          imageUrl: updatedProject.imageUrl,
        },
      });
    }

    // Update the associated Volunteering Opportunity
    const volunteeringOpportunity = await prisma.volunteeringOpportunity.findFirst({
        where: { title: `Volunteer for ${updatedProject.title}` },
    });

    if(volunteeringOpportunity){
        await prisma.volunteeringOpportunity.update({
            where: { id: volunteeringOpportunity.id },
            data: {
                title: `Volunteer for ${updatedProject.title}`,
                description: updatedProject.description,
                imageUrl: updatedProject.imageUrl,
            },
        });
    }


    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Error updating project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    const project = await prisma.event.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete the associated Donation Plan
    const donationPlan = await prisma.donationPlan.findFirst({
      where: { name: project.title, type: "PROJECT" },
    });
    if (donationPlan) {
      await prisma.donationPlan.delete({ where: { id: donationPlan.id } });
    }

    // Delete the associated Volunteering Opportunity
    const volunteeringOpportunity = await prisma.volunteeringOpportunity.findFirst({
        where: { title: `Volunteer for ${project.title}` },
    });

    if(volunteeringOpportunity){
        await prisma.volunteeringOpportunity.delete({ where: { id: volunteeringOpportunity.id } });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
  }
}
