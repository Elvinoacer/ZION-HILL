import { churchConfig } from "@/lib/church-config";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const sendReceiptSchema = z.object({
  donorName: z.string(),
  donorEmail: z.string(),
  amount: z.number(),
  date: z.string(),
  method: z.string(),
  type: z.string(),
  description: z.string().optional(),
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465", // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const generateReceiptHtml = (donation: z.infer<typeof sendReceiptSchema>) => {
  const formattedDate = new Date(donation.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #4CAF50;">Thank You for Your Donation!</h1>
        </div>
        <p>Dear ${donation.donorName},</p>
        <p>We are incredibly grateful for your generous donation. Your support helps us continue our mission and serve the community.</p>
        <div style="padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Donation Receipt</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Donation Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Kes${donation.amount.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date of Donation:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Method:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${
                  donation.method
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Donation Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${
                  donation.type
                }</td>
              </tr>
              ${
                donation.description
                  ? `
              <tr>
                <td style="padding: 8px;"><strong>Description:</strong></td>
                <td style="padding: 8px; text-align: right;">${donation.description}</td>
              </tr>
              `
                  : ""
              }
            </tbody>
          </table>
        </div>
        <p style="margin-top: 20px;">
          Thank you once again for your generosity. We are blessed to have you as part of our community.
        </p>
        <p>
          Sincerely,<br>
          The Church Leadership
        </p>
        <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
          <p>This is an automated receipt. No tax advice is provided in this email.</p>
          <p>&copy; ${new Date().getFullYear()} {churchConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = sendReceiptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { donorEmail, donorName } = validation.data;
    const htmlContent = generateReceiptHtml(validation.data);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: donorEmail,
      subject: `Donation Receipt from ${churchConfig.name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Receipt sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send receipt" },
      { status: 500 }
    );
  }
}
