/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export configuration due to NextAuth and API route dependencies
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}

module.exports = nextConfig
