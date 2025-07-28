/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Enable static export for Render
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://shadow-goose-api.onrender.com',
  },
  
  // Image optimization
  images: {
    domains: ['shadow-goose-api.onrender.com', 'shadow-goose-dashboard.onrender.com'],
    unoptimized: true, // For better standalone compatibility
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
