import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=Missing token', request.url));
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || new Date() > verificationToken.expires) {
      return NextResponse.redirect(new URL('/login?error=Invalid or expired token', request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=User not found', request.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        isActive: true,
      },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const alg = 'HS256'

    const jwt = await new jose.SignJWT({
        id: user.id,
        email: user.email,
        roles: user.roles,
        name: user.name,
        image: user.image,
      })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    const cookieStore = cookies();
    cookieStore.set('next-auth.session-token', jwt, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to the profile setup page
    console.log('NEXTAUTH_URL in verify-email:', process.env.NEXTAUTH_URL);
    const response = NextResponse.redirect(new URL('/setup-profile', request.url));

    return response;

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/login?error=Verification failed', request.url));
  }
}