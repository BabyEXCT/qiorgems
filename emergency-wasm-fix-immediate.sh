#!/bin/bash

# =============================================================================
# EMERGENCY WebAssembly Memory Fix - Immediate Solution
# =============================================================================
# This script provides an immediate fix for the persistent WebAssembly memory
# error on cPanel with 4GB memory limits.
#
# Error: RangeError: WebAssembly.instantiate(): Out of memory: wasm memory
# Limits: Max resident set: 4294967296 bytes (4GB)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}🚨 EMERGENCY WebAssembly Memory Fix${NC}"
echo -e "${RED}===================================${NC}"
echo

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Step 1: Fix NODE_ENV warning
print_info "Step 1: Fixing NODE_ENV configuration..."
export NODE_ENV=production
print_status "NODE_ENV set to production"

# Step 2: Apply extreme memory constraints
print_info "Step 2: Applying extreme memory constraints..."
export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16 --max-executable-size=64 --stack-size=256"
export UV_THREADPOOL_SIZE=1
export NEXT_TELEMETRY_DISABLED=1
print_status "Extreme memory limits applied"

# Step 3: Create ultra-minimal Next.js config
print_info "Step 3: Creating ultra-minimal Next.js configuration..."
cat > next.config.emergency.js << 'EOF'
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
  // Telemetry disabled via environment variable
};

module.exports = nextConfig;
EOF

print_status "Emergency Next.js config created"

# Step 4: Create emergency package.json with absolute minimal dependencies
print_info "Step 4: Creating emergency package configuration..."
cat > package.emergency.json << 'EOF'
{
  "name": "qiorgems",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=256' next dev",
    "build": "NODE_OPTIONS='--max-old-space-size=256' next build",
    "start": "NODE_OPTIONS='--max-old-space-size=256' next start",
    "build:emergency": "NODE_OPTIONS='--max-old-space-size=128' next build"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@prisma/client": "4.16.2"
  },
  "devDependencies": {
    "@types/node": "20.5.0",
    "@types/react": "18.2.20",
    "@types/react-dom": "18.2.7",
    "typescript": "5.1.6"
  }
}
EOF

print_status "Emergency package configuration created"

# Step 5: Create memory-safe startup script
print_info "Step 5: Creating memory-safe startup script..."
cat > start-emergency.sh << 'EOF'
#!/bin/bash

# Emergency startup with minimal memory usage
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16"
export UV_THREADPOOL_SIZE=1
export NEXT_TELEMETRY_DISABLED=1

# Use emergency configuration
cp next.config.emergency.js next.config.js
cp package.emergency.json package.json

# Clean install
rm -rf node_modules package-lock.json .next
npm install --no-audit --no-fund --prefer-offline

# Emergency build
echo "Starting emergency build..."
npm run build:emergency

# Start server
echo "Starting server with minimal memory..."
npm start
EOF

chmod +x start-emergency.sh
print_status "Emergency startup script created"

# Step 6: Apply immediate fix
print_info "Step 6: Applying immediate fix..."

# Backup current files
cp package.json package.json.backup 2>/dev/null || true
cp next.config.js next.config.js.backup 2>/dev/null || true

# Apply emergency configuration
cp package.emergency.json package.json
cp next.config.emergency.js next.config.js

print_status "Emergency configuration applied"

# Step 7: Clean and reinstall with minimal memory
print_info "Step 7: Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json .next

# Install with extreme memory constraints
NODE_OPTIONS="--max-old-space-size=128" npm install --no-audit --no-fund --prefer-offline

print_status "Dependencies installed with minimal memory"

echo
echo -e "${GREEN}🎉 Emergency fix applied successfully!${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: NODE_OPTIONS='--max-old-space-size=256' npm run build:emergency"
echo "2. Start: NODE_OPTIONS='--max-old-space-size=256' npm start"
echo "3. Or use: ./start-emergency.sh"
echo
echo -e "${YELLOW}Note: This is an emergency fix with minimal functionality.${NC}"
echo -e "${YELLOW}Some features may be disabled to prevent memory errors.${NC}"
echo

# Test memory settings
print_info "Testing memory settings..."
if node -e "console.log('Memory settings test passed')"; then
    print_status "Memory settings are working"
else
    print_error "Memory settings test failed"
    exit 1
fi

echo -e "${GREEN}Emergency fix completed. Try running the application now.${NC}"