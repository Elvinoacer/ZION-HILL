import nodemailer from 'nodemailer';

export const sendEmail = async (options: { to: string; subject: string; html: string }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendDonationReceipt = async (donationDetails: {
  amount: number;
  planName: string;
  donorName: string;
  donorEmail: string;
}) => {
  try {
    await sendEmail({
      to: donationDetails.donorEmail,
      subject: "Thank You for Your Donation!",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Thank You for Your Generosity!</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Your support makes a real difference</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Dear ${donationDetails.donorName},
            </p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="font-size: 16px; margin: 0 0 10px; font-weight: 500;">Donation Summary</p>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b;">Amount</span>
                <span style="font-weight: 600;">KES ${donationDetails.amount.toFixed(
                  2
                )}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #64748b;">Purpose</span>
                <span style="font-weight: 600;">${
                  donationDetails.planName
                }</span>
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your contribution helps us continue our mission and make a positive impact in our community.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; background: #e9f7ef; color: #2e7d32; padding: 12px 24px; border-radius: 24px; font-weight: 600; font-size: 14px;">
                Your donation is changing lives!
              </span>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
              With gratitude,<br/>
              <strong>The Church Team</strong>
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            © ${new Date().getFullYear()} Our Church. All rights reserved.
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error sending receipt:", err);
  }
};
