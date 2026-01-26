import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const skip = (page - 1) * pageSize;
    let userId = searchParams.get('userId');

    // Security: Non-admins can only see their own donations
    const isAdmin = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.FINANCE_ADMINISTRATOR);
    if (!isAdmin) {
      userId = session.user.id;
    }

    const whereClause: any = {
      type: { in: ['DONATION'] },
      reconciliationStatus: 'APPROVED',
    };

    if (userId) {
      whereClause.userId = userId;
    }

    // Add filtering based on query parameters if needed
    const searchQuery = searchParams.get('searchQuery');
    if (searchQuery) {
      whereClause.OR = [
        { donorName: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { method: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const reconciliationStatusFilter = searchParams.get('reconciliationStatusFilter');
    if (reconciliationStatusFilter && reconciliationStatusFilter !== 'all') {
      whereClause.reconciliationStatus = reconciliationStatusFilter;
    }

    const dateRange = searchParams.get('dateRange');
    if (dateRange === 'recent') {
      whereClause.date = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
    }

    const [donations, totalCount] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: whereClause,
        select: {
          id: true,
          description: true,
          date: true,
          amount: true,
          reconciliationStatus: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.transaction.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({ donations, totalCount });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}