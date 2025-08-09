import { NextResponse } from "next/server";

export async function GET() {
  // Ensure VAPID_PUBLIC_KEY is set in your environment variables
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;

  if (!publicKey) {
    console.error("VAPID_PUBLIC_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "VAPID public key not configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({ publicKey });
}
