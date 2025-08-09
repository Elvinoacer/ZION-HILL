
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'itineraries':
        const itineraries = await prisma.event.findMany({ where: { type: 'TRIP' } });
        return NextResponse.json(itineraries);
      case 'fundraisers':
        const fundraisers = await prisma.fund.findMany();
        return NextResponse.json(fundraisers);
      case 'missionaries':
        const missionaries = await prisma.user.findMany({ where: { roles: { some: { name: 'VOLUNTEER' } } } });
        return NextResponse.json(missionaries);
      case 'documents':
        const documents = await prisma.asset.findMany({ where: { type: 'DOCUMENT' } });
        return NextResponse.json(documents);
      case 'outreach-locations':
        const outreachLocations = await prisma.event.findMany({ where: { type: 'EVENT' } });
        return NextResponse.json(outreachLocations);
      case 'volunteers':
        const volunteers = await prisma.user.findMany({ where: { roles: { some: { name: 'VOLUNTEER' } } } });
        return NextResponse.json(volunteers);
      case 'metrics':
        // This is a placeholder. You'll need to define how to calculate these metrics.
        return NextResponse.json([]);
      case 'partners':
        const partners = await prisma.partner.findMany();
        return NextResponse.json(partners);
      case 'shared-documents':
        const sharedDocs = await prisma.asset.findMany({ where: { type: 'DOCUMENT' } });
        return NextResponse.json(sharedDocs);
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
      case 'itineraries':
        const newItinerary = await prisma.event.create({ data: { ...body, type: 'TRIP' } });
        return NextResponse.json(newItinerary);
      case 'fundraisers':
        const newFundraiser = await prisma.fund.create({ data: body });
        return NextResponse.json(newFundraiser);
      case 'documents':
        const newDocument = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT' } });
        return NextResponse.json(newDocument);
      case 'volunteers':
        const newVolunteer = await prisma.user.create({ data: body });
        return NextResponse.json(newVolunteer);
      case 'reports':
        // This is a placeholder. You'll need to define how to generate reports.
        return NextResponse.json({ message: 'Report generated' });
      case 'share':
        const newSharedDoc = await prisma.asset.create({ data: { ...body, type: 'DOCUMENT' } });
        return NextResponse.json(newSharedDoc);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
