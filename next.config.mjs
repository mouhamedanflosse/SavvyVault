/** @type {import('next').NextConfig} */
const nextConfig = {
  ignoreDuringBuilds: true,
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
};

export default nextConfig;
