import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.midjourney.com",
      },
      {
        protocol: "https",
        hostname: "c4.wallpaperflare.com",
      },
    ],
  },
};

export default nextConfig;
