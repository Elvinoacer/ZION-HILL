
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'streams':
        // This is a placeholder. You'll need to define how to model streams.
        return NextResponse.json([]);
      case 'sermons':
        const sermons = await prisma.sermon.findMany();
        return NextResponse.json(sermons);
      case 'assets':
        const assets = await prisma.asset.findMany();
        return NextResponse.json(assets);
      case 'content-blocks':
        // This is a placeholder. You'll need to define how to model content blocks.
        return NextResponse.json([]);
      case 'tickets':
        const tickets = await prisma.ticket.findMany();
        return NextResponse.json(tickets);
      case 'equipment':
        const equipment = await prisma.resource.findMany({ where: { type: 'EQUIPMENT' } });
        return NextResponse.json(equipment);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const body = await request.json();

  try {
    switch (type) {
      case 'camera-preset':
        // In a real app, you'd switch the camera preset
        return NextResponse.json({ message: 'Camera preset switched' });
      case 'lighting-scene':
        // In a real app, you'd recall the lighting scene
        return NextResponse.json({ message: 'Lighting scene recalled' });
      case 'process-sermon':
        // In a real app, you'd process the sermon
        return NextResponse.json({ message: 'Sermon processed' });
      case 'tag-asset':
        const taggedAsset = await prisma.asset.update({ where: { id: body.id }, data: { tags: { push: body.tag } } });
        return NextResponse.json(taggedAsset);
      case 'save-content-version':
        // In a real app, you'd save the content version
        return NextResponse.json({ message: 'Content version saved' });
      case 'create-ticket':
        const newTicket = await prisma.ticket.create({ data: body });
        return NextResponse.json(newTicket);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
