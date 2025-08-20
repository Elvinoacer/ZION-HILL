import { getLinkPreview } from "link-preview-js";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { url } = await request.json();

  try {
    const data = await getLinkPreview(url);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}
