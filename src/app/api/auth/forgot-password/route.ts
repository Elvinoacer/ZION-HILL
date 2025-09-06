import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { render } from '@react-email/render';
import { sendEmail } from '@/lib/email';
import PasswordResetEmail from '@/templates/PasswordResetEmail';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
        type: 'PASSWORD_RESET',
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const emailHtml = await render(PasswordResetEmail({ resetLink }));

    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Error generating password reset link:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
