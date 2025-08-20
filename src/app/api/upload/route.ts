
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new NextResponse("No file found", { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("[CLOUDINARY_UPLOAD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
