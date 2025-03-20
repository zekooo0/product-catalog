import type { NextConfig } from "next";

/**
 * Validate environment variables
 */
const validateEnv = () => {
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL'];
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Check .env.local.example for the required variables');
  }
};

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  validateEnv();
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add useful headers for security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default nextConfig;
