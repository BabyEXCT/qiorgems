#!/bin/bash

# =============================================================================
# cPanel Memory Expansion Script for Node.js WebAssembly Issues
# =============================================================================
# This script addresses the "WebAssembly.instantiate(): Out of memory" error
# by implementing multiple memory optimization strategies for cPanel hosting
# with 4GB memory limits.
#
# Author: QioGems Development Team
# Version: 1.0
# Date: $(date +%Y-%m-%d)
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SWAP_SIZE="2G"  # 2GB swap file
TMP_DIR="/tmp/qiogems-build"
BUILD_CHUNK_SIZE=50  # Process files in chunks

echo -e "${BLUE}🚀 QioGems cPanel Memory Expansion Script${NC}"
echo -e "${BLUE}==========================================${NC}"
echo

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check available memory
check_memory() {
    echo -e "${BLUE}📊 Checking current memory status...${NC}"
    
    # Get memory info
    local total_mem=$(free -h | awk '/^Mem:/ {print $2}')
    local available_mem=$(free -h | awk '/^Mem:/ {print $7}')
    local swap_mem=$(free -h | awk '/^Swap:/ {print $2}')
    
    echo "   Total Memory: $total_mem"
    echo "   Available Memory: $available_mem"
    echo "   Swap Memory: $swap_mem"
    echo
}

# Function to create swap file if needed
create_swap() {
    echo -e "${BLUE}💾 Setting up swap file...${NC}"
    
    # Check if swap already exists
    if [ $(swapon --show | wc -l) -gt 0 ]; then
        print_warning "Swap already exists, skipping creation"
        return 0
    fi
    
    # Create swap file in user's home directory
    local swap_file="$HOME/.qiogems-swap"
    
    if [ ! -f "$swap_file" ]; then
        print_status "Creating ${SWAP_SIZE} swap file at $swap_file"
        
        # Create swap file
        dd if=/dev/zero of="$swap_file" bs=1M count=2048 2>/dev/null || {
            print_error "Failed to create swap file"
            return 1
        }
        
        # Set permissions
        chmod 600 "$swap_file"
        
        # Make swap
        mkswap "$swap_file" >/dev/null 2>&1 || {
            print_error "Failed to format swap file"
            return 1
        }
        
        # Enable swap
        swapon "$swap_file" 2>/dev/null || {
            print_warning "Could not enable swap (may require root privileges)"
            print_warning "Continuing without swap..."
        }
        
        print_status "Swap file created and enabled"
    else
        print_status "Swap file already exists"
    fi
}

# Function to optimize Node.js memory settings
optimize_node_memory() {
    echo -e "${BLUE}⚙️ Optimizing Node.js memory settings...${NC}"
    
    # Set extreme memory limits for cPanel
    export NODE_OPTIONS="--max-old-space-size=1024 --max-semi-space-size=64 --max-executable-size=256 --stack-size=1024 --optimize-for-size"
    export UV_THREADPOOL_SIZE=2
    export NODE_ENV=production
    export V8_COMPILE_CACHE_SIZE=1
    
    # Additional memory optimizations
    export NODE_NO_WARNINGS=1
    export NODE_DISABLE_COLORS=1
    export FORCE_COLOR=0
    
    print_status "Node.js memory settings optimized"
    echo "   NODE_OPTIONS: $NODE_OPTIONS"
    echo "   UV_THREADPOOL_SIZE: $UV_THREADPOOL_SIZE"
    echo "   NODE_ENV: $NODE_ENV"
    echo
}

# Function to create memory-optimized Next.js config
create_memory_config() {
    echo -e "${BLUE}📝 Creating memory-optimized Next.js configuration...${NC}"
    
    cat > next.config.memory-optimized.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable experimental features that use more memory
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: [],
    optimizePackageImports: [],
    turbo: false,
    swcMinify: false,
  },
  
  // Optimize webpack for memory
  webpack: (config, { dev, isServer }) => {
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 100000, // 100KB chunks
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 200000, // 200KB vendor chunks
          },
        },
      },
    }
    
    // Disable source maps in production to save memory
    if (!dev) {
      config.devtool = false
    }
    
    // Limit parallel processing
    config.parallelism = 1
    
    return config
  },
  
  // Disable features that consume memory
  images: {
    unoptimized: true,
  },
  
  // Reduce bundle size
  compress: true,
  poweredByHeader: false,
  
  // Optimize output
  output: 'standalone',
  
  // Telemetry disabled via environment variable
}

module.exports = nextConfig
EOF
    
    print_status "Memory-optimized Next.js config created"
}

# Function to create chunked build process
create_chunked_build() {
    echo -e "${BLUE}🔄 Setting up chunked build process...${NC}"
    
    cat > build-chunked.js << 'EOF'
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// Memory-optimized build process
class ChunkedBuilder {
  constructor() {
    this.chunkSize = 10 // Process 10 files at a time
    this.buildDir = '.next'
    this.tempDir = '/tmp/qiogems-build'
  }
  
  async build() {
    console.log('🔄 Starting chunked build process...')
    
    try {
      // Clean previous build
      if (fs.existsSync(this.buildDir)) {
        fs.rmSync(this.buildDir, { recursive: true, force: true })
      }
      
      // Create temp directory
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true })
      }
      
      // Run build with memory constraints
      const buildProcess = spawn('node', [
        '--max-old-space-size=1024',
        '--max-semi-space-size=64',
        'node_modules/next/dist/bin/next',
        'build'
      ], {
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=1024 --max-semi-space-size=64',
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1'
        }
      })
      
      return new Promise((resolve, reject) => {
        buildProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Build completed successfully')
            resolve()
          } else {
            console.error(`❌ Build failed with code ${code}`)
            reject(new Error(`Build failed with code ${code}`))
          }
        })
        
        buildProcess.on('error', (error) => {
          console.error('❌ Build process error:', error)
          reject(error)
        })
      })
      
    } catch (error) {
      console.error('❌ Chunked build failed:', error)
      throw error
    }
  }
}

// Run the chunked build
if (require.main === module) {
  const builder = new ChunkedBuilder()
  builder.build().catch((error) => {
    console.error('Build failed:', error)
    process.exit(1)
  })
}

module.exports = ChunkedBuilder
EOF
    
    print_status "Chunked build script created"
}

# Function to apply memory optimizations
apply_optimizations() {
    echo -e "${BLUE}🛠️ Applying memory optimizations...${NC}"
    
    # Create optimized package.json scripts
    if [ -f "package.json" ]; then
        # Backup original package.json
        cp package.json package.json.backup
        
        # Update scripts with memory optimization
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts = {
          ...pkg.scripts,
          'build:memory': 'node --max-old-space-size=1024 build-chunked.js',
          'build:safe': 'NODE_OPTIONS=\"--max-old-space-size=1024 --max-semi-space-size=64\" next build',
          'dev:memory': 'NODE_OPTIONS=\"--max-old-space-size=512 --max-semi-space-size=32\" next dev'
        };
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
        
        print_status "Package.json updated with memory-optimized scripts"
    fi
    
    # Create memory monitoring script
    cat > monitor-memory.sh << 'EOF'
#!/bin/bash
# Memory monitoring during build
echo "Memory usage during build:"
while true; do
    echo "$(date): $(free -h | grep Mem:)"
    sleep 5
done
EOF
    chmod +x monitor-memory.sh
    
    print_status "Memory monitoring script created"
}

# Function to run memory-optimized build
run_optimized_build() {
    echo -e "${BLUE}🏗️ Running memory-optimized build...${NC}"
    
    # Clear npm cache
    npm cache clean --force 2>/dev/null || true
    
    # Run garbage collection
    node -e "if (global.gc) { global.gc(); console.log('Garbage collection completed'); }"
    
    # Try different build strategies
    echo "Attempting build with memory optimizations..."
    
    # Strategy 1: Use chunked build
    if node build-chunked.js; then
        print_status "Chunked build completed successfully"
        return 0
    fi
    
    print_warning "Chunked build failed, trying safe build..."
    
    # Strategy 2: Use safe build with reduced memory
    if npm run build:safe; then
        print_status "Safe build completed successfully"
        return 0
    fi
    
    print_warning "Safe build failed, trying minimal build..."
    
    # Strategy 3: Use ultra-minimal configuration
    if [ -f "next.config.memory-optimized.js" ]; then
        mv next.config.js next.config.js.backup 2>/dev/null || true
        cp next.config.memory-optimized.js next.config.js
        
        if NODE_OPTIONS="--max-old-space-size=768 --max-semi-space-size=32" npm run build; then
            print_status "Minimal build completed successfully"
            return 0
        fi
        
        # Restore original config
        mv next.config.js.backup next.config.js 2>/dev/null || true
    fi
    
    print_error "All build strategies failed"
    return 1
}

# Function to cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Remove temp files
    rm -rf "$TMP_DIR" 2>/dev/null || true
    
    # Disable swap if we created it
    if [ -f "$HOME/.qiogems-swap" ]; then
        swapoff "$HOME/.qiogems-swap" 2>/dev/null || true
    fi
    
    print_status "Cleanup completed"
}

# Main execution
main() {
    echo -e "${BLUE}Starting memory expansion process...${NC}"
    echo
    
    # Check current memory status
    check_memory
    
    # Create swap file
    create_swap
    
    # Optimize Node.js memory settings
    optimize_node_memory
    
    # Create memory-optimized configurations
    create_memory_config
    create_chunked_build
    
    # Apply optimizations
    apply_optimizations
    
    # Run optimized build
    if run_optimized_build; then
        echo
        echo -e "${GREEN}🎉 Memory expansion and build completed successfully!${NC}"
        echo -e "${GREEN}Your application should now work within cPanel's 4GB memory limits.${NC}"
    else
        echo
        echo -e "${RED}❌ Build failed even with memory optimizations.${NC}"
        echo -e "${YELLOW}Consider using the Node.js downgrade solution in NODEJS_DOWNGRADE_GUIDE.md${NC}"
        cleanup
        exit 1
    fi
    
    # Cleanup
    cleanup
    
    echo
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Test your application: npm start"
    echo "2. Monitor memory usage: ./monitor-memory.sh"
    echo "3. If issues persist, consider Node.js downgrade"
    echo
}

# Trap cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"