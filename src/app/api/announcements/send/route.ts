import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBulkEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        email: {
          not: null,
        },
      },
      select: {
        email: true,
      },
    });

    const emails = users.map((user) => user.email).filter((email): email is string => email !== null);

    if (emails.length > 0) {
      await sendBulkEmail({
        to: emails,
        subject: title,
        html: `<p>${content}</p>`,
      });
    }

    return NextResponse.json({ message: 'Announcement sent successfully' });
  } catch (error) {
    console.error('Failed to send announcement', error);
    return NextResponse.json({ error: 'Failed to send announcement' }, { status: 500 });
  }
}