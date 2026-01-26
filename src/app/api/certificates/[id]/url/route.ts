import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const certificateId = params.id;

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Check if the logged-in user is the owner of the certificate
    if (certificate.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json({ url: certificate.cloudinaryUrl });
  } catch (error) {
    console.error(
      `Error fetching certificate URL for ${certificateId}:`,
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
