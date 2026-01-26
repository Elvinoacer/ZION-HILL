
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@/generated/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'messages':
        // This is a placeholder. You'll need to define how to model messages.
        return NextResponse.json([]);
      case 'communication-templates':
        const communicationTemplates = await prisma.asset.findMany({ where: { type: 'TEMPLATE' } });
        return NextResponse.json(communicationTemplates);
      case 'events':
        const events = await prisma.event.findMany();
        return NextResponse.json(events);
      case 'documents':
        const documents = await prisma.asset.findMany({ where: { type: 'DOCUMENT' } });
        return NextResponse.json(documents);
      case 'document-templates':
        const documentTemplates = await prisma.asset.findMany({ where: { type: 'TEMPLATE' } });
        return NextResponse.json(documentTemplates);
      case 'users':
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            roles: true,
            isActive: true,
            profileComplete: true,
            createdAt: true,
          }
        });
        return NextResponse.json(users);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.SENIOR_PASTOR))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const body = await request.json();

  try {
    switch (type) {
      case 'route-message':
        // In a real app, you'd route the message
        return NextResponse.json({ message: 'Message routed' });
      case 'send-response':
        // In a real app, you'd send a response
        return NextResponse.json({ message: 'Response sent' });
      case 'confirm-event':
        const confirmedEvent = await prisma.event.update({ where: { id: body.id }, data: { status: 'Confirmed' } });
        return NextResponse.json(confirmedEvent);
      case 'reschedule-event':
        const rescheduledEvent = await prisma.event.update({ where: { id: body.id }, data: { date: body.date } });
        return NextResponse.json(rescheduledEvent);
      case 'preview-document':
        // In a real app, you'd preview the document
        return NextResponse.json({ message: 'Document previewed' });
      case 'generate-template':
        // In a real app, you'd generate the template
        return NextResponse.json({ message: 'Template generated' });
      case 'bulk-update':
        // In a real app, you'd perform a bulk update
        return NextResponse.json({ message: 'Bulk update complete' });
      case 'send-visitor-email':
        // In a real app, you'd send a visitor email
        return NextResponse.json({ message: 'Visitor email sent' });
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
