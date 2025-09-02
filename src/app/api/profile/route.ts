import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const familyId = searchParams.get("familyId");
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "user":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { family: true },
        });
        return NextResponse.json(user);
      case "family-members":
        if (!familyId) {
          return NextResponse.json(
            { error: "Family ID is required" },
            { status: 400 }
          );
        }
        const family = await prisma.family.findUnique({
          where: { id: familyId },
          include: { members: true },
        });
        return NextResponse.json(family?.members);
      case "membership-status":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
          );
        }
        const userRoles = await prisma.user.findUnique({
          where: { id: userId },
          // include: { roles: true },
        });
        return NextResponse.json(userRoles?.roles);
      default:
        return NextResponse.json(
          { error: "Invalid data type" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: User = await request.json();
  try {
    const user = await prisma.user.create({
      data: body,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "An error occured!" });
  }
}
