import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated, redirect to /login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Example: Only allow admin to access /admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && !req.nextauth.token?.roles?.includes("ADMIN")) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    // Example: Only allow worship leader to access /worship-leader routes
    if (req.nextUrl.pathname.startsWith("/worship-leader") && !req.nextauth.token?.roles?.includes("WORSHIP_LEADER")) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    // Add more role-based access control as needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/(authenticated)/:path*"], // Protect all routes under (authenticated)
};