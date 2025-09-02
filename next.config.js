// =============================================================================
// Ultra-Minimal Next.js Configuration for cPanel 4GB Memory Constraints
// =============================================================================
// This configuration disables WebAssembly and implements extreme memory
// optimizations to work within cPanel's 4GB memory limit.
//
// Author: QioGems Development Team
// Version: 1.0 - Ultra Minimal
// =============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ALL experimental features
  experimental: {
    serverComponentsExternalPackages: [],
    optimizePackageImports: [],
    esmExternals: false,
    serverActions: false,
    typedRoutes: false,
    instrumentationHook: false,
    webpackBuildWorker: false, // Disable webpack build worker
    cpus: 1, // Use only 1 CPU core
  },
  
  // Enable SWC minification in production
  swcMinify: true,

  // Ultra-minimal webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Disable source maps completely
    config.devtool = false;
    
    // Set memory limits
    config.optimization = {
      ...config.optimization,
      splitChunks: false, // Disable chunk splitting
      minimize: !dev, // Enable minification in production
      concatenateModules: false, // Disable module concatenation
      usedExports: false, // Disable tree shaking
      sideEffects: false,
    };
    
    // Reduce parallelism to absolute minimum
    config.parallelism = 1;
    
    // Disable WebAssembly support completely
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
      topLevelAwait: false,
    };
    
    // External all heavy dependencies
    if (!isServer) {
      config.externals = {
        ...config.externals,
        'lucide-react': 'lucide-react',
        '@prisma/client': '@prisma/client',
        'sweetalert2': 'sweetalert2',
        'zod': 'zod',
      };
    }
    
    // Disable all plugins that consume memory
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return ![
        'HotModuleReplacementPlugin',
        'ReactRefreshWebpackPlugin',
        'ForkTsCheckerWebpackPlugin',
        'ESLintWebpackPlugin',
      ].includes(pluginName);
    });
    
    // Set memory limits for Node.js
    config.node = {
      ...config.node,
      __dirname: false,
      __filename: false,
    };
    
    return config;
  },
  
  // Disable image optimization
  images: {
    unoptimized: true,
    domains: [],
    formats: [],
  },
  
  // Standalone output for deployment
  output: 'standalone',
  
  // Disable compression to save memory
  compress: false,
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Disable static optimization
  staticPageGenerationTimeout: 60,
  
  // Minimal environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  
  // Disable all optimizations that use memory
  optimizeFonts: false,
  
  // Minimal redirects and rewrites
  async redirects() {
    return [];
  },
  
  async rewrites() {
    return [];
  },
  
  async headers() {
    return [];
  },
};

// Log configuration for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Ultra-Minimal cPanel Configuration Loaded');
  console.log('   Memory Optimization: Maximum');
  console.log('   WebAssembly: Disabled');
  console.log('   Telemetry: Disabled');
  console.log('   Build Workers: Disabled');
  console.log('   Chunk Splitting: Disabled');
}

module.exports = nextConfig;