import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Completely disable static generation
  experimental: {
    isrMemoryCacheSize: 0,
    // Disable static generation
    staticPageGenerationTimeout: 0,
  },
  
  // Force all pages to be dynamic
  trailingSlash: false,
  
  // Disable static optimization
  generateStaticParams: false,
  
  // Disable static exports
  exportPathMap: undefined,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://navimpact-api.onrender.com',
  },
  
  // Image optimization
  images: {
    domains: ['navimpact-web.onrender.com', 'navimpact-api.onrender.com'],
    unoptimized: true, // Disable image optimization during build
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
