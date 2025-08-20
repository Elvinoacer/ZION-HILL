
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        issuedDate: 'desc',
      },
      select: {
        id: true,
        certificateType: true,
        recipientName: true,
        issuedDate: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching public certificates:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
