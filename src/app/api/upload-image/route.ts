import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'church-web-v2' }, // Optional: specify a folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return resolve(NextResponse.json({ error: 'Cloudinary upload failed.' }, { status: 500 }));
          }
          if (result && result.secure_url) {
            return resolve(NextResponse.json({ url: result.secure_url }));
          } else {
            return resolve(NextResponse.json({ error: 'Cloudinary upload failed: No secure_url returned.' }, { status: 500 }));
          }
        }
      ).end(buffer);
    });

  } catch (error) {
    console.error("Error in upload-image API:", error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
