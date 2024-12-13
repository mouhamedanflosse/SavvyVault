import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_CONVEX_URL.split("//")[1],
      },
      {
        hostname: "img.clerk.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
    ],
  },
  ignoreDuringBuilds: true,
};

export default nextConfig;
