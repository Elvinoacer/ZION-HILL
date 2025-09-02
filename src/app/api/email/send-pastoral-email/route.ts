import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { recipient, subject, message } = await req.json();

    if (!recipient || !subject || !message) {
      return new NextResponse('Recipient, subject, and message are required', { status: 400 });
    }

    await sendMail({
      to: recipient,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    return new NextResponse('Email sent successfully', { status: 200 });
  } catch (error) {
    console.error('[SEND_PASTORAL_EMAIL_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}