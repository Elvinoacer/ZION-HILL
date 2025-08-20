import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BaptismStatus } from "@/lib/types";

export async function GET(request: Request) { // Add 'request: Request' parameter
  try {
    const { searchParams } = new URL(request.url); // Get search params from request URL
    const searchTerm = searchParams.get("search"); // Get the 'search' query parameter

    const whereClause: any = {
      baptismApplicationStatus: {
        not: null,
      },
    };

    if (searchTerm) {
      whereClause.OR = [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive", // Case-insensitive search
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const candidates = await prisma.user.findMany({
      where: whereClause, // Use the dynamic whereClause
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        baptismApplicationStatus: true,
        baptismClassCompleted: true,
        baptismDate: true,
      },
    });

    return NextResponse.json(candidates);
  } catch (error: any) { // Add ': any' to error for better type handling
    console.error("Error fetching baptism candidates:", error);
    return NextResponse.json(
      { message: "Failed to fetch baptism candidates", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, baptismApplicationStatus, baptismClassCompleted, baptismDate } = await request.json();

    const updatedCandidate = await prisma.user.update({
      where: { id },
      data: {
        baptismApplicationStatus: baptismApplicationStatus as BaptismStatus,
        baptismClassCompleted: baptismClassCompleted,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        baptismApplicationStatus: true,
        baptismClassCompleted: true,
        baptismDate: true,
      },
    });

    return NextResponse.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating baptism candidate:", error);
    return NextResponse.json(
      { message: "Failed to update baptism candidate", error: error.message },
      { status: 500 }
    );
  }
}
