import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, imageData, jsonData } = await request.json();

    if (!name || !imageData || !jsonData) {
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
    // Append the buffer as a Blob, specifying filename and type
    formData.append(
      "file",
      new Blob([buffer], { type: `image/${fileType}` }),
      fileName
    );

    // --- Call the actual image upload endpoint internally ---
    // Using a relative path for internal API calls is generally better
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/upload-image`,
      {
        method: "POST",
        body: formData, // FormData is automatically handled by fetch
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Error uploading image:", errorData);
      return NextResponse.json(
        { message: "Failed to upload image" },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();
    const imageUrl = uploadResult.url;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image upload did not return a URL" },
        { status: 500 }
      );
    }

    const newDesign = await prisma.canvasDesign.create({
      data: {
        name,
        imageUrl,
        jsonData,
        // userId: 'some_user_id' // You might want to add actual user ID here if authenticated
      },
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Error saving canvas design:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const designs = await prisma.canvasDesign.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error("Error fetching canvas designs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
