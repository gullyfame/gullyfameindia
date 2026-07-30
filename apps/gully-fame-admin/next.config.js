/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Yeh naya block add karo
  async rewrites() {
    return [
      {
        source: '/v1/api/:path*',
        destination: 'https://gullyfame.com/v1/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig