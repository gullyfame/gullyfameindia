/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ye line TypeScript errors ko build fail karne se rokegi
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ye line ESLint errors ko build fail karne se rokegi
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig