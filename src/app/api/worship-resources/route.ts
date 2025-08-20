import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorization: Only Worship Leader or Admin can create resources
  const isWorshipLeader = session.user.roles?.includes("WORSHIP_LEADER");
  const isAdmin = session.user.roles?.includes("ADMIN");

  // if (!isWorshipLeader && !isAdmin) {
  //   return NextResponse.json(
  //     { error: "Forbidden: You do not have permission to create resources" },
  //     { status: 403 }
  //   );
  // }

  try {
    const body = await req.json(); // Try to parse as JSON first
    const { title, url, type, serviceId } = body;

    if (!title || !url || !type || !serviceId) {
      return NextResponse.json(
        { error: "Title, URL, type, and serviceId are required" },
        { status: 400 }
      );
    }

    const resource = await prisma.worshipResource.create({
      data: {
        title,
        url,
        serviceId,
        type,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error: any) {
    // If JSON parsing fails, try formData (for file uploads)
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const title = formData.get("title") as string;
      const serviceId = formData.get("serviceId") as string;
      const type = formData.get("type") as string;

      if (!file || !title || !serviceId || !type) {
        return NextResponse.json(
          {
            error:
              "File, title, type, and serviceId are required for file upload",
          },
          { status: 400 }
        );
      }

      // In a real application, you would upload the file to a cloud storage service (e.g., S3, Cloudinary)
      // and get a URL back. For this example, we'll just use a placeholder.
      const blob = await put(file.name, file, {
        access: "public",
      });
      const url = blob.url;

      const resource = await prisma.worshipResource.create({
        data: {
          title,
          url,
          serviceId,
          type,
        },
      });

      return NextResponse.json(resource, { status: 201 });
    } catch (formError: any) {
      console.error("Error creating resource (JSON or FormData):", formError);
      return NextResponse.json(
        { error: "Failed to create resource" },
        { status: 500 }
      );
    }
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
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to update resources" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Resource ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { title, url, type } = body;

    if (!title || !url || !type) {
      return NextResponse.json(
        { error: "Title, URL, and type are required" },
        { status: 400 }
      );
    }

    const updatedResource = await prisma.worshipResource.update({
      where: { id },
      data: {
        title,
        url,
        type,
      },
    });
    return NextResponse.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error.message);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to delete resources" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Resource ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.worshipResource.delete({ where: { id } });
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting resource:", error.message);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
