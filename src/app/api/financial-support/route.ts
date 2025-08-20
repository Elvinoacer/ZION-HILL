import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.financialSupportRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching financial support requests:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, amountRequested, reason } = body;

    if (!name || !email || !amountRequested || !reason) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newRequest = await prisma.financialSupportRequest.create({
      data: {
        name,
        email,
        phone,
        amountRequested,
        reason,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating financial support request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
