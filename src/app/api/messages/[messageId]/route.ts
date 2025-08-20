import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    console.log("Attempting to delete message with ID:", messageId); // Add logging

    if (!messageId) {
      console.error("Message ID is missing!"); // Add logging
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    console.log("Message deleted successfully:", messageId); // Add logging
    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error deleting message in API route:", errorMessage); // More specific logging
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
