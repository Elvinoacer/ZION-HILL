import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const birthdayMembers = await prisma.$queryRaw`
      SELECT * FROM "User"
      WHERE EXTRACT(MONTH FROM birthdate) = ${todayMonth}
      AND EXTRACT(DAY FROM birthdate) = ${todayDay}
    `;

    return NextResponse.json(birthdayMembers);
  } catch (error) {
    console.error('Error fetching birthday members:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
