import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


export async function sendBulkEmail({ to, subject, html }: { to: string[], subject: string, html: string }) {
  try {
    // Use BCC to send to multiple recipients without revealing their addresses to each other
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      bcc: to,
      subject,
      html,
    });
    console.log(`Bulk email sent to ${to.length} recipients`);
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw new Error('Failed to send bulk email');
  }
}