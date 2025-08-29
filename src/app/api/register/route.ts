import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendMail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: ['MEMBER'],
        isActive: false,
        profileComplete: false,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

    await sendMail({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Verify your email address',
      html: `<p>Please click this link to verify your email address: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    return NextResponse.json({ message: 'Registration successful. Please check your email to verify your account.' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}