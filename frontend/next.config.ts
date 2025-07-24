import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Disable static generation during build to prevent API calls
  experimental: {
    // This ensures all pages are rendered dynamically
    isrMemoryCacheSize: 0,
  },
  
  // Disable static optimization to prevent build-time API calls
  staticPageGenerationTimeout: 0,
  
  // Force all pages to be dynamic
  trailingSlash: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://navimpact-api.onrender.com',
  },
  
  // Image optimization
  images: {
    domains: ['navimpact-web.onrender.com', 'navimpact-api.onrender.com'],
  },
  
  // Security headers - Remove CSP for now to fix the eval issue
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Temporarily remove CSP to fix eval issues
          // { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" }
        ],
      },
    ];
  },
};

export default nextConfig;
