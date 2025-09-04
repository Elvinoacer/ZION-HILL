"use client";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { sendMulticastNotification } from '@/lib/firebaseAdmin';

export async function POST() {
  try {
    // 1. Fetch today's birthdays
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const birthdayMembers = await prisma.$queryRaw<any[]>`
      SELECT id, name, email FROM "User"
      WHERE EXTRACT(MONTH FROM birthdate) = ${todayMonth}
      AND EXTRACT(DAY FROM birthdate) = ${todayDay}
    `;

    if (birthdayMembers.length === 0) {
      return NextResponse.json({ message: 'No birthdays today' });
    }

    // 2. Fetch all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fcmTokens: {
          select: {
            token: true,
          },
        },
      },
    });

    // 3. Filter out the birthday members
    const usersToNotify = allUsers.filter(
      (user) => !birthdayMembers.some((birthdayMember) => birthdayMember.id === user.id)
    );

    // 4. Send email and push notifications
    const birthdayNames = birthdayMembers.map((member) => member.name).join(', ');

    // Send email notifications
    const emailSubject = `It's ${birthdayNames}'s Birthday!`;
    const emailHtml = `<p>Wish ${birthdayNames} a happy birthday today!</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/member/birthdays">Send your wishes</a></p>`;

    const userEmails = usersToNotify.map((user) => user.email).filter((email): email is string => !!email);

    if (userEmails.length > 0) {
      await sendEmail({
        to: userEmails.join(','),
        subject: emailSubject,
        html: emailHtml,
      });
    }

    // Send push notifications
    const fcmTokens = usersToNotify
      .flatMap((user) => user.fcmTokens)
      .map((token) => token.token);

    if (fcmTokens.length > 0) {
      await sendMulticastNotification(
        fcmTokens,
        `It's ${birthdayNames}'s Birthday!`,
        `Wish them a happy birthday today!`
      );
    }

    // 5. Send personalized notification to birthday members
    for (const birthdayMember of birthdayMembers) {
      const personalizedSubject = `Happy Birthday, ${birthdayMember.name}!`;
      const personalizedHtml = `<p>Happy Birthday, ${birthdayMember.name}!</p><p>Your church family is celebrating with you. <a href="${process.env.NEXT_PUBLIC_APP_URL}/member/my-birthday">Click here to see your birthday wishes</a>.</p>`;

      if (birthdayMember.email) {
        await sendEmail({
          to: birthdayMember.email,
          subject: personalizedSubject,
          html: personalizedHtml,
        });
      }

      const birthdayMemberTokens = (await prisma.fcmToken.findMany({
        where: { userId: birthdayMember.id },
        select: { token: true },
      })).map(t => t.token);

      if (birthdayMemberTokens.length > 0) {
        await sendMulticastNotification(
          birthdayMemberTokens,
          `Happy Birthday, ${birthdayMember.name}! 🎂`,
          `We're celebrating with you today!`
        );
      }
    }

    return NextResponse.json({ message: 'Birthday notifications sent successfully' });
  } catch (error) {
    console.error('Error sending birthday notifications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
