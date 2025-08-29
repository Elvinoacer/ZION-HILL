import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, address, birthdate, photo, familyId, newFamilyName } = await request.json();

    let finalFamilyId = familyId;

    if (newFamilyName) {
      const newFamily = await prisma.family.create({
        data: {
          name: newFamilyName,
          createdById: session.user.id,
        },
      });
      finalFamilyId = newFamily.id;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone,
        address,
        birthdate,
        photo,
        familyId: finalFamilyId,
        profileComplete: true,
      },
    });

    return NextResponse.json({ message: 'Profile setup complete' }, { status: 200 });
  } catch (error) {
    console.error('Profile setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
