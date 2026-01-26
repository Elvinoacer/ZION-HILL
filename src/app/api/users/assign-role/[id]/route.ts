import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { RoleName } from "@/generated/prisma"; // Import RoleName enum

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: userId } = params;
    const { roleToAdd: roleToAddString } = await request.json(); // Rename to avoid confusion

    // Validate roleToAddString against RoleName enum
    if (!Object.values(RoleName).includes(roleToAddString)) {
      return new NextResponse("Invalid role provided", { status: 400 });
    }

    const roleToAdd: RoleName = roleToAddString as RoleName; // Explicitly cast to RoleName enum

    // Check if the authenticated user has permission to assign roles
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true },
    });

    if (
      !currentUser ||
      (!currentUser.roles.includes(RoleName.ADMIN) &&
        !currentUser.roles.includes(RoleName.SENIOR_PASTOR))
    ) {
      return new NextResponse(
        "Forbidden: You do not have permission to assign roles",
        { status: 403 }
      );
    }

    // Prevent non-admins from assigning ADMIN role
    if (
      roleToAdd === RoleName.ADMIN &&
      !currentUser.roles.includes(RoleName.ADMIN)
    ) {
      return new NextResponse("Forbidden: Only ADMINs can assign ADMIN role", {
        status: 403,
      });
    }

    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true }, // Select roles to ensure it's fetched as RoleName[]
    });

    if (!userToUpdate) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Ensure existing roles are treated as RoleName enum values
    const existingRoles: RoleName[] = userToUpdate.roles.map(role => role as RoleName);

    // Add the new role if it's not already present
    const updatedRoles = Array.from(new Set([...existingRoles, roleToAdd]));

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: updatedRoles,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error assigning role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
