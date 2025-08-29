/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all memory-intensive features
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: [],
  },
  
  // Minimize webpack usage
  webpack: (config, { isServer }) => {
    // Disable source maps completely
    config.devtool = false;
    
    // Minimize chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
    };
    
    // Reduce parallelism to minimum
    config.parallelism = 1;
    
    // External large dependencies
    if (!isServer) {
      config.externals = {
        ...config.externals,
        'lucide-react': 'lucide-react',
        '@prisma/client': '@prisma/client',
      };
    }
    
    return config;
  },
  
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  
  // Standalone output
  output: 'standalone',
  
  // Disable compression
  compress: false,
  
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;
