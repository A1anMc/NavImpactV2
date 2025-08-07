/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Static export configuration for Render deployment
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['navimpact-api-staging.onrender.com', 'navimpact-web-staging.onrender.com'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://navimpact-api-staging.onrender.com',
  },
  
  // Base path for static export
  basePath: '',
  
  // Asset prefix for static files
  assetPrefix: '',
  
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
  
  // Simplified headers for debugging
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
