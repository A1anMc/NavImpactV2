/** @type {import('next').NextConfig} */

const nextConfig = {
  // Production optimization
  output: 'standalone',
  distDir: '.next',
  
  // Security: Disable powered by header
  poweredByHeader: false,
  
  // Compression for better performance
  compress: true,
  
  // Image optimization with security
  images: {
    domains: process.env.NODE_ENV === 'production' 
      ? ['sge-dashboard-web.onrender.com', 'sge-dashboard-api.onrender.com']
      : ['localhost', '127.0.0.1'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Environment variables (non-sensitive only)
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_API_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://sge-dashboard-api.onrender.com'
        : 'http://localhost:8000'
    ),
    ENVIRONMENT: process.env.NODE_ENV || 'development',
  },

  // Basic security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  // Production optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig