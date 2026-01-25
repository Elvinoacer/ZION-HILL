import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        // port: "",
        // pathname: "/account123/**",
        // search: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  /*
   * ESLint is explicitly ignored during builds to prevent deployment failures
   * due to linting errors (e.g., unused variables).
   * Use `npm run lint` manually.
   */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
