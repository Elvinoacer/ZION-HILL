

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encode } from 'next-auth/jwt';
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
      if (verificationToken) {
        await prisma.verificationToken.deleteMany({
          where: {
            identifier: verificationToken.identifier,
            expires: { lte: new Date() },
          },
        });
      }
      return NextResponse.redirect(new URL('/login?error=Invalid or expired token', request.url));
    }

    if (verificationToken.type !== 'EMAIL_VERIFICATION') {
      return NextResponse.redirect(new URL('/login?error=Invalid token type', request.url));
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

    const sessionToken = await encode({
      secret: process.env.NEXTAUTH_SECRET!,
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        photo: user.photo,
        profileComplete: user.profileComplete,
        sub: user.id, // Subject, standard JWT claim
      },
    });

    const cookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';

    cookies().set(cookieName, sessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to the profile setup page, passing the original callbackUrl
    const callbackUrl = searchParams.get('callbackUrl');
    
    // Construct redirect to setup-profile, preserving the ultimate destination
    const setupUrl = new URL('/setup-profile', request.url);
    if (callbackUrl) {
      setupUrl.searchParams.set('callbackUrl', callbackUrl);
    }
    
    return NextResponse.redirect(setupUrl);

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/login?error=Verification failed', request.url));
  }
}
