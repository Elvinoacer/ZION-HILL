import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        issuedDate: "desc",
      },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      userId,
      certificateType,
      cloudinaryUrl,
      issuedDate,
      eventName,
      pastorName,
      churchName,
      churchLocation,
      certificateId,
      briefDescription,
      recipientName,
    } = await request.json();

    if (!certificateType || !cloudinaryUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        ...(userId && { user: { connect: { id: userId } } }), // Connect user if userId is provided
        certificateType,
        cloudinaryUrl,
        issuedDate: issuedDate ? new Date(issuedDate) : new Date(),
        eventName,
        pastorName,
        churchName,
        churchLocation,
        certificateId,
        briefDescription,
        recipientName,
      },
    });

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("Error saving certificate:", error);
    return NextResponse.json(
      { message: "Failed to save certificate", error: error.message },
      { status: 500 }
    );
  }
}
