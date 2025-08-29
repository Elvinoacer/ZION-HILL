import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const families = await prisma.family.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return NextResponse.json(families, { status: 200 });
  } catch (error) {
    console.error('Family search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
