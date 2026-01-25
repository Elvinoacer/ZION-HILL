import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rolePermissions: { [key: string]: string[] } = {
  "/admin": ["ADMIN", "SENIOR_PASTOR"],
  "/children_youth_director": ["CHILDREN_YOUTH_DIRECTOR", "SENIOR_PASTOR"],
  "/communications_officer": ["COMMUNICATIONS_OFFICER", "SENIOR_PASTOR"],
  "/counselor": ["COUNSELOR", "SENIOR_PASTOR"],
  "/discipleship_leader": ["DISCIPLESHIP_LEADER", "SENIOR_PASTOR"],
  "/events_manager": ["EVENTS_MANAGER", "SENIOR_PASTOR"],
  "/finance_administrator": ["FINANCE_ADMINISTRATOR", "SENIOR_PASTOR"],
  "/member": ["MEMBER", "SENIOR_PASTOR"],
  "/outreach_director": ["OUTREACH_DIRECTOR", "SENIOR_PASTOR"],
  "/overall_ministries_coordinator": [
    "OVERALL_MINISTRIES_COORDINATOR",
    "SENIOR_PASTOR",
  ],
  "/secretary": ["SECRETARY", "SENIOR_PASTOR"],
  "/senior_pastor": ["SENIOR_PASTOR"],
  "/small_groups_leader": ["SMALL_GROUPS_LEADER", "SENIOR_PASTOR"],
  "/tech_media_manager": ["TECH_MEDIA_MANAGER", "SENIOR_PASTOR"],
  "/volunteer_coordinator": ["VOLUNTEER_COORDINATOR", "SENIOR_PASTOR"],
  "/worship_leader": ["WORSHIP_LEADER", "SENIOR_PASTOR"],
};

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const userRoles = (token?.roles || []) as string[];

    const protectedPath = Object.keys(rolePermissions).find((path) =>
      pathname.startsWith(path)
    );

    if (protectedPath) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
      }

      const requiredRoles = rolePermissions[protectedPath];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return NextResponse.redirect(new URL("/denied", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const protectedPath = Object.keys(rolePermissions).find((path) =>
          pathname.startsWith(path)
        );

        if (protectedPath) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/children_youth_director/:path*",
    "/communications_officer/:path*",
    "/counselor/:path*",
    "/discipleship_leader/:path*",
    "/events_manager/:path*",
    "/finance_administrator/:path*",
    "/member/:path*",
    "/outreach_director/:path*",
    "/overall_ministries_coordinator/:path*",
    "/secretary/:path*",
    "/senior_pastor/:path*",
    "/small_groups_leader/:path*",
    "/tech_media_manager/:path*",
    "/volunteer_coordinator/:path*",
    "/worship_leader/:path*",
  ],
};
