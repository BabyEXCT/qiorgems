/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export configuration due to NextAuth and API route dependencies
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Removed deprecated experimental options
}

module.exports = nextConfig
