import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { subject, text, html } = await request.json();

  if (!subject || (!text && !html)) {
    return NextResponse.json({ error: 'Subject and either text or html are required' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_PORT === '465', // Use `true` for port 465, `false` for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Fetch all subscribed users (assuming users with a specific role or a newsletter subscription flag)
    // For simplicity, let's assume all users in the 'User' model are potential recipients.
    // In a real app, you'd filter by a 'isSubscribedToNewsletter' flag or similar.
    const subscribedUsers = await prisma.user.findMany({
      where: { email: { not: null } }, // Only users with an email
      select: { email: true },
    });

    const recipientEmails = subscribedUsers.map(user => user.email).filter(Boolean) as string[];

    if (recipientEmails.length === 0) {
      return NextResponse.json({ message: 'No subscribers found to send newsletter' }, { status: 200 });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      bcc: recipientEmails, // Use bcc to send to multiple recipients without revealing all emails
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: `Newsletter sent to ${recipientEmails.length} subscribers` });
  } catch (error: any) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
