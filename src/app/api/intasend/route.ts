import { NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { amount, phone, donationId, donationType, description, name, email, recurring } = await request.json();

  if (!amount || !phone || !donationId) {
    return NextResponse.json(
      { error: "Amount, phone number, and donation ID are required" },
      { status: 400 }
    );
  }

  try {
    let transactionData: any = {
      type: "DONATION",
      amount: amount,
      method: "MPESA",
      description: description || `Donation`,
      donorName: name || "Anonymous Donor",
      donorEmail: email || null,
      recurring: recurring || false,
      reconciliationStatus: "PENDING",
    };

    if (session?.user?.id) {
      transactionData.userId = session.user.id;
    }

    if (donationType === 'plan') {
      if (donationId !== 'general') {
        transactionData.donationPlanId = donationId;
      }
    } else if (donationType === 'giving') {
      transactionData.givingId = donationId;
    }

    // 1. Create a pending transaction in your database
    const newTransaction = await prisma.transaction.create({
      data: transactionData,
    });

    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY as string,
      process.env.INTASEND_SECRET_KEY as string,
      false // Set to true for test environment, false for production
    );

    const collection = intasend.collection();
    const intasendResponse = await collection.mpesaStkPush({
      amount: amount,
      phone_number: phone,
      api_ref: newTransaction.id, // Use your transaction ID as the API reference
      first_name: name || undefined,
      email: email || undefined,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/intasend-webhook`,
    });

    // 3. Return your transaction ID along with IntaSend's response
    return NextResponse.json({ ...intasendResponse, transactionId: newTransaction.id });
  } catch (error: any) {
    console.error("IntaSend API Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message || "Failed to initiate M-Pesa STK Push",
      },
      { status: error.response?.status || 500 }
    );
  }
}
