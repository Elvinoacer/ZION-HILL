import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { render } from '@react-email/render';
import { sendEmail } from '@/lib/email';
import OtpEmail from '@/templates/OtpEmail';
import { randomInt } from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otp = randomInt(100000, 999999).toString();
    const expires = new Date(new Date().getTime() + 60 * 1000); // 1 minute from now

    try {
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: otp,
          expires,
          type: 'OTP',
        },
      });
    } catch (dbError) {
      console.error('Database error while creating verification token:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    const emailHtml = await render(OtpEmail({ otp }));

    await sendEmail({
      to: email,
      subject: 'Your One-Time Password',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
