import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email'; // Assuming you have an email sending utility

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await sendEmail({
      to: email,
      subject: `A message from your Pastor: ${subject}`,
      html: `<p>${message}</p>`,
    });

    return new NextResponse('Email sent', { status: 200 });
  } catch (error) {
    console.error('[PASTORAL_EMAIL_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
