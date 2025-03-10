import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  },
  // Enable compression for better performance
  compress: true,
  // Optimize for production builds
  reactStrictMode: true,
};

export default nextConfig;
