import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const member = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        image: true,
        membersince: true,
        ministryMemberships: {
          select: {
            ministry: {
              select: {
                name: true,
              },
            },
          },
        },
        // Add other public fields as needed
        // Do NOT include sensitive information like email, phone, address, password, roles, etc.
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member profile:", error);
    return NextResponse.json({ error: "Error fetching member profile" }, { status: 500 });
  }
}
