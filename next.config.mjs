import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_CONVEX_URL.split("//")[1],
        // protocol: "https",
        // pathname: "/api/storage/*",
        // port: "",
      },
    ],
  },
};

export default nextConfig;
