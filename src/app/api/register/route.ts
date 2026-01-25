import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';
import { sanitizeName, isValidName } from '@/lib/sanitize';

export async function POST(request: Request) {
  try {
    const { name, email, password, callbackUrl } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // --- INPUT SANITIZATION & VALIDATION ---
    const sanitizedName = sanitizeName(name);

    if (!isValidName(sanitizedName)) {
      return NextResponse.json(
        { error: 'Invalid name. Names must be 2-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods.' },
        { status: 400 }
      );
    }

    // Basic email format validation (Zod on frontend handles most, but double-check here)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }
    // --- END SANITIZATION ---

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: sanitizedName, // Use sanitized name
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
        type: 'EMAIL_VERIFICATION',
      },
    });

    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    let verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
    
    if (callbackUrl) {
      verificationUrl += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }

    await sendEmail({
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