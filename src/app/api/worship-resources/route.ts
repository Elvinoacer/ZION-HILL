import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { put } from "@vercel/blob";
import { AssetType } from "@/generated/prisma";

// Helper function to map frontend resource type to Prisma AssetType enum
function mapResourceTypeToAssetType(resourceType: string): AssetType {
  switch (resourceType.toUpperCase()) {
    case "VIDEO":
      return AssetType.VIDEO;
    case "AUDIO":
      return AssetType.AUDIO;
    case "IMAGE":
      return AssetType.IMAGE;
    case "PDF":
      return AssetType.DOCUMENT;
    case "LINK":
      return AssetType.RESOURCE; // Or DOCUMENT, depending on what 'LINK' implies
    default:
      return AssetType.RESOURCE; // Default or throw an error for unknown types
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorization: Only Worship Leader or Admin can create resources
  const isWorshipLeader = session.user.roles?.includes("WORSHIP_LEADER");
  const isAdmin = session.user.roles?.includes("ADMIN");

  if (!isWorshipLeader && !isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to create resources" },
      { status: 403 }
    );
  }

  try {
    const contentType = req.headers.get("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const title = formData.get("title") as string;
      const serviceId = formData.get("serviceId") as string;
      const type = formData.get("type") as string;
      const assetType = mapResourceTypeToAssetType(type);

      if (!file || !title || !serviceId || !type) {
        return NextResponse.json(
          {
            error: "File, title, type, and serviceId are required for file upload",
          },
          { status: 400 }
        );
      }

      const blob = await put(file.name, file, {
        access: "public",
      });
      const url = blob.url;

      const resource = await prisma.worshipResource.create({
        data: {
          title,
          url,
          serviceId,
          assetType, // Use the mapped assetType
        },
      });

      return NextResponse.json(resource, { status: 201 });
    } else {
      // Handle JSON data
      const body = await req.json();
      const { title, url, type, serviceId } = body;
      const assetType = mapResourceTypeToAssetType(type);

      if (!title || !url || !type || !serviceId) {
        return NextResponse.json({ error: "Title, URL, type, and serviceId are required" }, { status: 400 });
      }

      const resource = await prisma.worshipResource.create({
        data: {
          title,
          url,
          serviceId,
          assetType, // Use the mapped assetType
        },
      });

      return NextResponse.json(resource, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");

  try {
    const resources = await prisma.worshipResource.findMany({
      where: serviceId ? { serviceId } : undefined,
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isWorshipLeader = session.user.roles?.includes("WORSHIP_LEADER");
  const isAdmin = session.user.roles?.includes("ADMIN");

  if (!isWorshipLeader && !isAdmin) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to update resources" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, url, type } = body;
    const assetType = mapResourceTypeToAssetType(type);

    if (!title || !url || !type) {
      return NextResponse.json({ error: "Title, URL, and type are required" }, { status: 400 });
    }

    const updatedResource = await prisma.worshipResource.update({
      where: { id },
      data: {
        title,
        url,
        assetType,
      },
    });
    return NextResponse.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error.message);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isWorshipLeader = session.user.roles?.includes("WORSHIP_LEADER");
  const isAdmin = session.user.roles?.includes("ADMIN");

  if (!isWorshipLeader && !isAdmin) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to delete resources" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
  }

  try {
    await prisma.worshipResource.delete({ where: { id } });
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting resource:", error.message);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
