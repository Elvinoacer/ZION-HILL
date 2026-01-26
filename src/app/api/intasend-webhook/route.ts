import { prisma } from "@/lib/prisma";
import DonationThankYouEmail from "@/templates/DonationThankYouEmail";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendNotification } from "@/lib/notification-service";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-Intasend-Signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const secret = process.env.INTASEND_SECRET_KEY;
    if (!secret) {
        console.error("INTASEND_SECRET_KEY is not defined");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid webhook signature received");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const transactionId = payload.api_ref; // This should be the transaction ID we sent
    const intasendState = payload.state; // e.g., "COMPLETE", "FAILED", "PENDING"
    const paymentMethod = payload.method; // e.g., "M-PESA", "CARD-PAYMENT"

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

    let dataToUpdate: any = {
      reconciliationStatus: newReconciliationStatus,
    };

    if (paymentMethod) {
      if (paymentMethod === "M-PESA") {
        dataToUpdate.method = "MPESA";
      } else {
        dataToUpdate.otherPaymentMethod = paymentMethod;
      }
    }

    // Update the transaction status
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: dataToUpdate,
      include: { donationPlan: true, giving: true }, // Include both
    });

    // Send email only if the status is COMPLETE and donor email is available
    if (intasendState === "COMPLETE" && updatedTransaction.donorEmail) {
      try {
        const userEmail = updatedTransaction.donorEmail;
        const userName = updatedTransaction.donorName || "Valued Contributor";
        const transactionAmount = updatedTransaction.amount;
        const transactionFund =
          updatedTransaction.donationPlan?.name ||
          updatedTransaction.giving?.name ||
          "General Contribution";

        const emailHtml = await render(
          DonationThankYouEmail({
            name: userName,
            amount: transactionAmount,
            transactionId: updatedTransaction.id,
            fund: transactionFund,
          })
        );

        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM, // Your verified sender email
          to: userEmail,
          subject: "Thank You for Your Generous Donation!",
          html: emailHtml,
        });
        console.log("Thank you email sent successfully to:", userEmail);
      } catch (emailError) {
        console.error("Error sending thank you email:", emailError);
      }

      // Send Push Notification
      if (updatedTransaction.userId) {
        try {
          await sendNotification({
            userIds: [updatedTransaction.userId],
            title: "Donation Received",
            body: `Thank you for your generous gift of KES ${transactionAmount} to ${transactionFund}.`,
            data: {
              url: "/member/giving", // Redirect to giving history
              transactionId: updatedTransaction.id,
            },
          });
        } catch (notifyError) {
          console.error("Error sending donation notification:", notifyError);
        }
      }
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
