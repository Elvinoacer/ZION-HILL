import { NextResponse } from "next/server";
import { RoleName } from "@/generated/prisma";

export async function GET() {
  try {
    const roles = Object.values(RoleName).map((name, index) => ({
      id: index + 1, // Simple ID for frontend, not from DB
      name: name,
    }));
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Error fetching roles" },
      { status: 500 }
    );
  }
}
