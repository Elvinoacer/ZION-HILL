import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EventType } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const startDateParam = searchParams.get("startDate");
  const ministryId = searchParams.get("ministryId");

  try {
    let whereClause: any = { type: "SERVICE" };

    if (type) {
      whereClause.type = type.toUpperCase() as EventType;
    }

    if (startDateParam) {
      const startDate = new Date(startDateParam);
      whereClause.createdAt = {
        gte: startDate,
      };
    }

    if (ministryId) {
      whereClause.ministryId = ministryId;
    }

    const services = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  let { type, date, worshipMinistryId, ministryId, ...data } = body; // Destructure ministryId separately
  try {
    // If ministryId is not provided, try to find the 'Worship' ministry and assign its ID
    if (!ministryId) {
      const worshipMinistry = await prisma.ministry.findFirst({
        where: { name: "Worship Ministry" }, // Assuming the worship ministry is named "Worship"
      });
      if (worshipMinistry) {
        ministryId = worshipMinistry.id || worshipMinistryId;
      } else {
        console.warn(
          "Worship ministry not found. Service will be created without a ministryId."
        );
      }
    }

    const newService = await prisma.event.create({
      data: {
        ...data,
        type: type.toUpperCase() as EventType,
        date: new Date(date),
        ministryId,
      }, // Include ministryId
    });
    return NextResponse.json(newService);
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: `Error creating data: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();
  const { type, date, ...data } = body; // Destructure date separately

  if (!id) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedService = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        type: type ? (type.toUpperCase() as EventType) : undefined,
        date: date ? new Date(date) : undefined, // Convert date string to Date object if present
      },
    });
    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: `Error updating data: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting data" }, { status: 500 });
  }
}
