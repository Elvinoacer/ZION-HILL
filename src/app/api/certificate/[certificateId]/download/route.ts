
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { certificateId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    const { certificateId } = params;
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId, userId: user.id },
      include: { course: true },
    });

    if (!certificate) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Draw a border
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.1, 0.5, 0.8),
      borderWidth: 2,
    });

    // Add content
    page.drawText("Certificate of Completion", {
      x: 150,
      y: height - 80,
      font,
      size: 24,
      color: rgb(0, 0, 0),
    });

    page.drawText("This certifies that", {
      x: 220,
      y: height - 140,
      size: 18,
    });

    page.drawText(certificate.recipientName || "", {
      x: 200,
      y: height - 180,
      font,
      size: 22,
      color: rgb(0.1, 0.5, 0.8),
    });

    page.drawText(`has successfully completed the course`, {
      x: 160,
      y: height - 220,
      size: 18,
    });

    page.drawText(certificate.course?.title || "", {
      x: 180,
      y: height - 260,
      font,
      size: 20,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Return the PDF with correct headers
    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate.pdf"`,
      },
    });

  } catch (error) {
    console.error("[CERTIFICATE_DOWNLOAD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
