// =============================================================================
// Next.js Configuration Optimized for cPanel Memory Constraints
// =============================================================================
// This configuration addresses WebAssembly memory issues and optimizes
// Next.js for cPanel hosting with 4GB memory limits.
//
// Author: QioGems Development Team
// Version: 1.0
// =============================================================================

const { nextWebpackConfig } = require('./webpack.memory-optimized')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable experimental features that consume memory
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: [],
    optimizePackageImports: [],
    turbo: false, // Disable Turbopack to save memory
    swcMinify: false, // Use terser instead for better memory control
    esmExternals: false, // Disable ESM externals
    serverActions: false, // Disable server actions if not needed
    typedRoutes: false, // Disable typed routes
    instrumentationHook: false, // Disable instrumentation
  },
  
  // Webpack configuration with memory optimizations
  webpack: (config, options) => {
    // Apply memory optimizations
    const optimizedConfig = nextWebpackConfig(config, options)
    
    // Additional cPanel-specific optimizations
    if (!options.dev) {
      // Disable source maps completely in production
      optimizedConfig.devtool = false
      
      // Optimize for size over speed
      optimizedConfig.mode = 'production'
      
      // Additional memory-saving plugins
      const webpack = require('webpack')
      
      optimizedConfig.plugins.push(
        // Define plugin to eliminate dead code
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.NEXT_TELEMETRY_DISABLED': JSON.stringify('1'),
        }),
        
        // Ignore moment.js locales to reduce bundle size
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      )
    }
    
    // Externalize large dependencies to reduce memory usage
    optimizedConfig.externals = {
      ...optimizedConfig.externals,
      // Externalize canvas if not needed
      canvas: 'canvas',
      // Externalize sharp if not needed
      sharp: 'sharp',
    }
    
    return optimizedConfig
  },
  
  // Disable features that consume memory
  images: {
    unoptimized: true, // Disable image optimization to save memory
    domains: [], // No external domains
    formats: ['image/webp'], // Only WebP format
    minimumCacheTTL: 60, // Short cache TTL
  },
  
  // Optimize output
  output: 'standalone', // Standalone output for easier deployment
  
  // Note: telemetry is disabled via environment variable NEXT_TELEMETRY_DISABLED=1
  
  // Compress responses
  compress: true,
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Optimize redirects and rewrites
  async redirects() {
    return []
  },
  
  async rewrites() {
    return []
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: process.env.NODE_ENV || 'production',
  },
  
  // Optimize server-side rendering
  serverRuntimeConfig: {
    // Server-only config
  },
  
  publicRuntimeConfig: {
    // Client and server config
  },
  
  // Optimize static generation
  trailingSlash: false,
  
  // Disable X-Powered-By header
  poweredByHeader: false,
  
  // Optimize build
  generateBuildId: async () => {
    // Use a simple build ID to save memory
    return 'cpanel-optimized'
  },
  
  // Custom server configuration for cPanel
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
  
  // Optimize TypeScript
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build to save memory
  },
  
  // Optimize static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Configure base path if needed
  basePath: '',
  
  // Optimize page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Optimize API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit body size
    },
    responseLimit: '8mb', // Limit response size
  },
  
  // Optimize SWC (if enabled)
  swcMinify: false, // Disable SWC minification to use terser
  
  // Optimize compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Optimize modularize imports
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  
  // Optimize bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, options) => {
      const optimizedConfig = nextWebpackConfig(config, options)
      
      if (!options.dev) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        optimizedConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            generateStatsFile: false,
          })
        )
      }
      
      return optimizedConfig
    },
  }),
}

// Memory monitoring in development
if (process.env.NODE_ENV === 'development' && process.env.MONITOR_MEMORY === 'true') {
  const originalWebpack = nextConfig.webpack
  nextConfig.webpack = (config, options) => {
    const result = originalWebpack ? originalWebpack(config, options) : config
    
    // Add memory monitoring
    result.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('MemoryMonitor', () => {
          const used = process.memoryUsage()
          console.log('\n📊 Build Memory Usage:')
          console.log(`   RSS: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`)
          console.log(`   Heap Total: ${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`)
          console.log(`   Heap Used: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`)
          console.log(`   External: ${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`)
          
          // Warn if memory usage is high
          if (used.heapUsed > 1024 * 1024 * 1024) { // 1GB
            console.log('\n⚠️  High memory usage detected!')
            console.log('   Consider using the memory expansion script.')
          }
        })
      }
    })
    
    return result
  }
}

// Export configuration
module.exports = nextConfig

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Using cPanel-optimized Next.js configuration')
  console.log('   Memory optimizations: Enabled')
  console.log('   Webpack chunking: Optimized')
  console.log('   Bundle size: Minimized')
  console.log('   Telemetry: Disabled')
}