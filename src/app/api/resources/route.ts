import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResourceType } from "@/generated/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  console.log("Received request for resources:", { category, type });

  let resourceType: ResourceType | undefined;
  if (type) {
    if (Object.values(ResourceType).includes(type as ResourceType)) {
      resourceType = type as ResourceType;
    } else {
      console.warn("Invalid resource type received:", type);
      return new NextResponse("Invalid resource type", { status: 400 });
    }
  }

  try {
    console.log("Prisma query where clause:", { category, type: resourceType });
    const resources = await prisma.resource.findMany({
      where: {
        category: category ? category : undefined,
        type: resourceType ? resourceType : undefined,
      },
    });
    console.log("Fetched resources:", resources.length);
    return NextResponse.json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error.message, error.stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
