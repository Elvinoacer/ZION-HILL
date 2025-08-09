
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'templates':
        const templates = await prisma.asset.findMany({ where: { type: 'TEMPLATE' } });
        return NextResponse.json(templates);
      case 'assets':
        const assets = await prisma.asset.findMany();
        return NextResponse.json(assets);
      case 'communications':
        // This is a placeholder. You'll need to define how to model communications.
        return NextResponse.json([]);
      case 'bulletins':
        const bulletins = await prisma.asset.findMany({ where: { type: 'DOCUMENT' } });
        return NextResponse.json(bulletins);
      case 'metrics':
        // This is a placeholder. You'll need to define how to calculate these metrics.
        return NextResponse.json([]);
      case 'ab-tests':
        // This is a placeholder. You'll need to define how to model A/B tests.
        return NextResponse.json([]);
      case 'alerts':
        const alerts = await prisma.ticket.findMany({ where: { priority: 'HIGH' } });
        return NextResponse.json(alerts);
      case 'statements':
        const statements = await prisma.asset.findMany({ where: { type: 'DOCUMENT' } });
        return NextResponse.json(statements);
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
      case 'posts':
        // In a real app, you'd handle posting to social media
        return NextResponse.json({ message: 'Posted to selected platforms' });
      case 'style-checks':
        // In a real app, you'd run an AI-powered style check
        return NextResponse.json({ message: 'Style check complete' });
      case 'communications':
        // This is a placeholder. You'll need to define how to model communications.
        return NextResponse.json({ message: 'Communication sent' });
      case 'attendance':
        // In a real app, you'd record attendance
        return NextResponse.json({ message: 'Attendance recorded' });
      case 'ab-tests':
        // This is a placeholder. You'll need to define how to model A/B tests.
        return NextResponse.json({ message: 'A/B test started' });
      case 'alerts':
        const newAlert = await prisma.ticket.create({ data: { ...body, priority: 'HIGH' } });
        return NextResponse.json(newAlert);
      case 'statements':
        const newStatement = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT' } });
        return NextResponse.json(newStatement);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
