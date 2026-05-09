/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Allow configuring backend URL via environment variable
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

