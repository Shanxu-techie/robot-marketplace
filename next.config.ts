import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  output: 'standalone',
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGIN
    ? [process.env.ALLOWED_DEV_ORIGIN]
    : [],
}

export default nextConfig
