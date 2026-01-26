import { NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const {
      amount,
      email,
      name,
      description,
      donationId,
      donationType,
      recurring,
    } = await request.json();

    if (!amount || !email || !name || !donationId || !donationType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let transactionData: any = {
      type: donationType === "giving" ? "GIVING" : "DONATION",
      amount: parseFloat(amount),
      description:
        description || (donationType === "giving" ? "Giving" : "Donation"),
      donorName: name,
      donorEmail: email,
      recurring: recurring || false,
      reconciliationStatus: "PENDING",
    };

    if (session?.user?.id) {
      transactionData.userId = session.user.id;
    }

    if (donationType === "plan") {
      if (donationId !== "general") {
        transactionData.donationPlanId = donationId;
      }
    } else if (donationType === "giving") {
      transactionData.givingId = donationId;
    }

    // 1. Create a pending transaction in your database
    const newTransaction = await prisma.transaction.create({
      data: transactionData,
    });

    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY!,
      process.env.INTASEND_SECRET_KEY!,
      false
    );

    const collection = intasend.collection();

    const response = await collection.charge({
      amount: parseFloat(amount),
      currency: "KES",
      email: email,
      first_name: name.split(" ")[0],
      last_name: name.split(" ").slice(1).join(" "),
      host: process.env.NEXT_PUBLIC_APP_URL!,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations/success?transactionId=${newTransaction.id}`,
      api_ref: newTransaction.id, // Use your transaction ID
      meta: {
        description:
          description || (donationType === "giving" ? "Giving" : "Donation"),
        transactionId: newTransaction.id,
      },
    });

    return NextResponse.json({
      checkoutUrl: response.url,
      transactionId: newTransaction.id,
    });
  } catch (error: any) {
    console.error("Full error object:", JSON.stringify(error, null, 2));
    console.error(
      "Error creating Intasend checkout session:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data?.detail || "Internal Server Error" },
      { status: 500 }
    );
  }
}
