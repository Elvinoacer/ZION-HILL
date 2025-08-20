import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing design ID" },
        { status: 400 }
      );
    }

    const design = await prisma.canvasDesign.findUnique({
      where: {
        id: id,
      },
    });

    if (!design) {
      return NextResponse.json(
        { message: "Design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error("Error fetching single canvas design:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, imageData, jsonData } = await request.json();

    if (!id || !name || !imageData || !jsonData) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Convert base64 imageData to a Blob/Buffer suitable for FormData ---
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileType = imageData.split(";")[0].split("/")[1]; // e.g., 'png', 'jpeg'
    const fileName = `canvas-design-${Date.now()}.${fileType}`;

    // Create FormData
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: `image/${fileType}` }),
      fileName
    );

    // --- Call the actual image upload endpoint internally ---
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/upload-image`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Error uploading image during update:", errorData);
      return NextResponse.json(
        { message: "Failed to upload new image" },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();
    const imageUrl = uploadResult.url;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image upload did not return a URL during update" },
        { status: 500 }
      );
    }

    const updatedDesign = await prisma.canvasDesign.update({
      where: {
        id: id,
      },
      data: {
        name,
        imageUrl, // Update with new image URL
        jsonData,
      },
    });

    return NextResponse.json(updatedDesign, { status: 200 });
  } catch (error) {
    console.error("Error updating canvas design:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
