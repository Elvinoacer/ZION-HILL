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
      name: p.title,
      description: p.description || '',
      imageUrl: p.imageUrl,
      fundraisingGoal: p.financials?.[0]?.budget || 0,
      fundraisingProgress: p.financials?.[0]?.revenue || 0,
      goal: p.financials?.[0]?.budget || 0,
      progress: p.financials?.[0]?.revenue || 0,
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

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const newProject = await prisma.event.create({ data: { ...body, type: 'EVENT', tags: [...(body.tags || []), 'project'] } });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    const updatedProject = await prisma.event.update({
      where: { id },
      data: { ...body, type: 'EVENT', tags: [...(body.tags || []), 'project'] },
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
