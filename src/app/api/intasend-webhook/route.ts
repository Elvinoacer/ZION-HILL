import { churchConfig } from "@/lib/church-config";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to send email receipt
const sendDonationReceipt = async (donationDetails: {
  amount: number;
  planName: string;
  donorName: string;
  donorEmail: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: donationDetails.donorEmail,
          subject: "Thank You for Your Contribution!",
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
                <p style="font-size: 16px; margin: 0 0 10px; font-weight: 500;">Contribution Summary</p>
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
                  Your contribution is changing lives!
                </span>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                With gratitude,<br/>
                <strong>The Church Team</strong>
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
              © ${new Date().getFullYear()} {churchConfig.name}. All rights reserved.
            </div>
          </div>
        `,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to send email");
  } catch (err) {
    console.error("Error sending receipt:", err);
  }
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Intasend Webhook Received:", payload);

    // TODO: Implement webhook verification (e.g., using a secret key from Intasend)

    const transactionId = payload.api_ref; // This should be the transaction ID we sent
    const intasendState = payload.state; // e.g., "COMPLETE", "FAILED", "PENDING"

    if (!transactionId) {
      console.error("Webhook payload missing api_ref (transactionId)");
      return NextResponse.json(
        { error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { donationPlan: true, giving: true }, // Include both
    });

    if (!transaction) {
      console.error(`Transaction with ID ${transactionId} not found.`);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    let newReconciliationStatus = transaction.reconciliationStatus;

    switch (intasendState) {
      case "COMPLETE":
        newReconciliationStatus = "APPROVED";
        break;
      case "FAILED":
        newReconciliationStatus = "FLAGGED"; // Or a specific FAILED status if you have one
        break;
      // Add other states as needed, e.g., "PENDING", "CANCELLED"
      default:
        // For any other state, keep the current status or set to PENDING/FLAGGED
        newReconciliationStatus = "PENDING";
        break;
    }

    // Update the transaction status
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { reconciliationStatus: newReconciliationStatus },
      include: { donationPlan: true, giving: true }, // Include both
    });

    // Send email only if the status is COMPLETE and donor email is available
    if (intasendState === "COMPLETE" && updatedTransaction.donorEmail) {
      const planName = updatedTransaction.donationPlan?.name || updatedTransaction.giving?.name || "General Contribution";
      await sendDonationReceipt({
        amount: updatedTransaction.amount,
        planName: planName,
        donorName: updatedTransaction.donorName || "Contributor",
        donorEmail: updatedTransaction.donorEmail,
      });
      console.log(`Email sent for transaction ${transactionId}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Intasend webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
