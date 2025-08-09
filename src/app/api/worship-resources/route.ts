import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const serviceId = formData.get('serviceId') as string;

    // In a real application, you would upload the file to a cloud storage service (e.g., S3, Cloudinary)
    // and get a URL back. For this example, we'll just use a placeholder.
    const url = `/uploads/${file.name}`;

    const resource = await prisma.worshipResource.create({
      data: {
        title,
        url,
        serviceId,
        type: 'RESOURCE',
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');

  if (!serviceId) {
    return NextResponse.json({ error: 'serviceId is required' }, { status: 400 });
  }

  try {
    const resources = await prisma.worshipResource.findMany({
      where: { serviceId },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}
