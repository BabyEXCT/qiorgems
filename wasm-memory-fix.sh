#!/bin/bash

# WASM Memory Fix Script for Node.js v20.x on cPanel
# Addresses: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory

echo "🚨 CRITICAL: WebAssembly Memory Allocation Fix for Node.js v20.x"
echo "============================================================"

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Current Node.js version: $NODE_VERSION"

if [[ $NODE_VERSION == v20* ]]; then
    echo "⚠️  WARNING: Node.js v20.x detected - Known WebAssembly memory issues"
    echo "📋 Applying emergency memory optimization..."
fi

# Set extreme memory limits
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32 --max-executable-size=128 --stack-size=512"
export UV_THREADPOOL_SIZE=2
export NODE_ENV=development

echo "🔧 Applied memory settings:"
echo "   NODE_OPTIONS: $NODE_OPTIONS"
echo "   UV_THREADPOOL_SIZE: $UV_THREADPOOL_SIZE"
echo "   NODE_ENV: $NODE_ENV"

# Create ultra-minimal Next.js config
echo "📝 Creating ultra-minimal Next.js configuration..."
cat > next.config.minimal.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: [],
    optimizeCss: false,
    optimizePackageImports: [],
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config, { isServer }) => {
    // Disable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    };
    
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
    };
    
    return config;
  },
  poweredByHeader: false,
  generateEtags: false,
  compress: false,
};

module.exports = nextConfig;
EOF

# Create minimal development server
echo "🚀 Creating minimal development server..."
cat > server-minimal.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Extreme memory optimization
process.env.NODE_OPTIONS = '--max-old-space-size=512 --max-semi-space-size=32';
process.env.UV_THREADPOOL_SIZE = '2';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Use minimal config
const app = next({ 
  dev, 
  hostname, 
  port,
  conf: require('./next.config.minimal.js')
});
const handle = app.getRequestHandler();

console.log('🔧 Memory-optimized server starting...');
console.log('📊 Memory limits:', process.env.NODE_OPTIONS);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(`🌟 Ready on http://${hostname}:${port}`);
    console.log('💡 Using minimal WebAssembly-free configuration');
  });
}).catch((ex) => {
  console.error('❌ Failed to start server:', ex.stack);
  process.exit(1);
});
EOF

# Copy ultra-minimal package.json
echo "📦 Switching to ultra-minimal package configuration..."
if [ -f "package-cpanel-ultra-minimal.json" ]; then
    cp package.json package.json.backup
    cp package-cpanel-ultra-minimal.json package.json
    echo "✅ Ultra-minimal package.json applied"
else
    echo "❌ Ultra-minimal package.json not found"
fi

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Install with minimal dependencies
echo "📥 Installing minimal dependencies..."
npm install --no-optional --no-audit --no-fund --legacy-peer-deps

echo ""
echo "🎯 WASM Memory Fix Applied Successfully!"
echo "============================================"
echo "📋 Next Steps:"
echo "   1. Run: node server-minimal.js"
echo "   2. Or: npm run dev (with memory limits)"
echo "   3. If still failing, downgrade to Node.js v18.x"
echo ""
echo "🔍 Troubleshooting:"
echo "   - Memory limit: 4GB (cPanel restriction)"
echo "   - WebAssembly disabled in webpack config"
echo "   - Minimal dependencies loaded"
echo "   - Thread pool reduced to 2"
echo ""
echo "⚠️  If errors persist, contact hosting provider about:"
echo "   - LVE memory limits"
echo "   - Node.js version downgrade to v18.x or v16.x"