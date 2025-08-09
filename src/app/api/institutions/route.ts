import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const institutions = await prisma.institution.findMany();
    return NextResponse.json(institutions);
  } catch (error: any) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutions", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, description, address, contactInfo, imageUrl } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    const newInstitution = await prisma.institution.create({
      data: {
        name,
        type,
        description,
        address,
        contactInfo,
        imageUrl,
      },
    });

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error: any) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      { error: "Failed to create institution", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  const { name, type, description, address, contactInfo, imageUrl } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Institution ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: {
        name,
        type,
        description,
        address,
        contactInfo,
        imageUrl,
      },
    });
    return NextResponse.json(updatedInstitution);
  } catch (error: any) {
    console.error("Error updating institution:", error);
    return NextResponse.json(
      { error: "Failed to update institution", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Institution ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.institution.delete({ where: { id } });
    return NextResponse.json({ message: "Institution deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting institution:", error);
    return NextResponse.json(
      { error: "Failed to delete institution", details: error.message },
      { status: 500 }
    );
  }
}
