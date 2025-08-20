import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'gateways':
        const gateways = await prisma.gateway.findMany();
        return NextResponse.json(gateways);
      case 'recurring-gifts':
        const recurringGifts = await prisma.recurringGift.findMany();
        return NextResponse.json(recurringGifts);
      case 'transactions':
        const transactions = await prisma.transaction.findMany();
        return NextResponse.json(transactions);
      // Add other GET types here if needed
      default:
        return NextResponse.json({ message: 'Church admin API - Please specify a valid type' });
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
      case 'switch-gateway':
        const { gatewayId } = body;
        // Implement logic to update gateway status in Prisma
        // For example, find the gateway by ID and update its status
        const updatedGateway = await prisma.gateway.update({
          where: { id: gatewayId },
          data: { status: 'Offline' }, // Assuming switching means setting to offline or a failover state
        });
        return NextResponse.json(updatedGateway);
      case 'notify-donor':
        const { giftId } = body;
        // Implement logic to notify donor (e.g., send email, update status)
        // For example, update a field in RecurringGift to mark as notified
        const updatedGift = await prisma.recurringGift.update({
          where: { id: giftId },
          data: { status: 'Notified' }, // Or some other status
        });
        return NextResponse.json(updatedGift);
      // Add other POST types here if needed
      default:
        return NextResponse.json({ message: 'Church admin action received - Please specify a valid type' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error processing action' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // Example: Update a church admin record
    return NextResponse.json({ message: 'Church admin record updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // Example: Delete a church admin record
    return NextResponse.json({ message: 'Church admin record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting data' }, { status: 500 });
  }
}