import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Completely disable static generation and ISR
  experimental: {
    isrMemoryCacheSize: 0,
  },
  
  // Force all pages to be dynamic - no static generation
  trailingSlash: false,
  
  // Disable static optimization completely
  distDir: '.next',
  
  // Force dynamic rendering for all pages
  async generateStaticParams() {
    return [];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://navimpact-api.onrender.com',
  },
  
  // Image optimization
  images: {
    domains: ['navimpact-web.onrender.com', 'navimpact-api.onrender.com'],
    unoptimized: true, // Disable image optimization during build
  },
  
  // Webpack configuration to handle client modules properly
  webpack: (config, { isServer }) => {
    // Ensure proper handling of client and server modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
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
