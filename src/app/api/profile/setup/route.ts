import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, address, birthdate, photo, familyId, newFamilyName } = await request.json();

    const sanitize = (str: string | null | undefined) => {
      if (!str) return str;
      return str.split('\0').join('');
    };

    // Sanitize all incoming and session strings that will be written to the DB
    const sanitizedUserId = sanitize(session.user.id!);
    const sanitizedName = sanitize(session.user.name);
    const sanitizedEmail = sanitize(session.user.email);
    const sanitizedImage = sanitize(session.user.image); // <-- The missing piece

    // Handle Family Creation
    let finalFamilyId = sanitize(familyId);
    if (newFamilyName) {
      const newFamily = await prisma.family.create({
        data: {
          name: sanitize(newFamilyName)!,
          createdById: sanitizedUserId!,
        },
      });
      finalFamilyId = newFamily.id;
    }

    // Perform a single, comprehensive update that also cleans potential bad data.
    await prisma.user.update({
      where: { id: sanitizedUserId! },
      data: {
        // Clean existing fields from session
        name: sanitizedName,
        email: sanitizedEmail,
        image: sanitizedImage, // <-- The missing piece
        // Add new profile fields
        phone: sanitize(phone),
        address: sanitize(address),
        birthdate: birthdate ? new Date(birthdate) : null,
        photo: sanitize(photo), // This is the newly uploaded photo
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
