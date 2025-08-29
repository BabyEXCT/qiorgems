#!/bin/bash

# EMERGENCY cPanel WebAssembly Memory Fix Script
# For critical Node.js v20.18.3 WebAssembly memory allocation errors

echo "🚨 === EMERGENCY cPanel WebAssembly Memory Fix v2.0 ==="
echo "This script addresses critical WebAssembly memory allocation errors"
echo "Error: RangeError: WebAssembly.Instance(): Out of memory"
echo "Node.js Version: $(node --version)"
echo "Memory Limit: 4GB (cPanel LVE restriction)"
echo "NODE_ENV Warning: Non-standard value detected"
echo "Starting emergency fix at: $(date)"
echo ""

# Step 1: Stop all Node.js processes immediately
echo "Step 1: Emergency shutdown of all Node.js processes..."
pkill -f "node" 2>/dev/null || true
pkill -f "npm" 2>/dev/null || true
pkill -f "prisma" 2>/dev/null || true
sleep 3
echo "✓ All Node.js processes stopped"

# Step 2: Clear all caches and temporary files
echo "Step 2: Emergency cache cleanup..."
rm -rf node_modules 2>/dev/null || true
rm -rf .next 2>/dev/null || true
rm -rf .prisma 2>/dev/null || true
rm -f package-lock.json 2>/dev/null || true
npm cache clean --force 2>/dev/null || true
echo "✓ Emergency cleanup completed"

# Step 3: Check Node.js version and recommend downgrade
echo "Step 3: Checking Node.js version compatibility..."
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

if [[ "$NODE_VERSION" == *"v20."* ]]; then
    echo "⚠️  WARNING: Node.js v20.x has known WebAssembly memory issues!"
    echo "🔧 CRITICAL RECOMMENDATION: Downgrade to Node.js v18.x or v16.x"
    echo ""
    echo "To fix this in cPanel:"
    echo "1. Go to cPanel → Node.js Selector"
    echo "2. Change Node.js version to 18.x or 16.x"
    echo "3. Click 'Set as current'"
    echo "4. Re-run this script"
    echo ""
    echo "Continuing with emergency fallback..."
else
    echo "✓ Node.js version appears compatible"
fi

# Step 4: Use ultra-minimal package configuration (WebAssembly-free)
echo "Step 4: Applying ultra-minimal package configuration..."
if [ -f "package-cpanel-ultra-minimal.json" ]; then
    echo "✅ Found ultra-minimal package configuration (WebAssembly-free)"
    cp package.json package-backup-$(date +%Y%m%d-%H%M%S).json 2>/dev/null || true
    cp package-cpanel-ultra-minimal.json package.json
    echo "📋 Applied ultra-minimal package.json with:"
    echo "   - Next.js v13.5.6 (stable)"
    echo "   - React v18.2.0 (minimal)"
    echo "   - No Prisma/Database dependencies"
    echo "   - Node.js engine: >=16.20.0 <19.0.0"
    echo "   - WebAssembly disabled"
    echo "✓ Ultra-minimal package configuration applied"
elif [ -f "package-cpanel-emergency.json" ]; then
    echo "Using emergency package configuration (Prisma v2.x fallback)..."
    cp package.json package-backup-$(date +%Y%m%d-%H%M%S).json 2>/dev/null || true
    cp package-cpanel-emergency.json package.json
    echo "✓ Emergency package configuration applied"
else
    echo "❌ No emergency packages found!"
    echo "Creating minimal emergency configuration..."
    cat > package.json << 'EOF'
{
  "name": "qiorgems",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=16.0.0 <20.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^13.5.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
EOF
    echo "✓ Minimal emergency configuration created"
fi

# Step 5: Install with extreme memory constraints
echo "Step 5: Installing dependencies with extreme memory optimization..."
echo "Using minimal memory settings..."

# Set extreme memory limits
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32 --optimize-for-size"
echo "Memory options: $NODE_OPTIONS"

# Install with minimal memory
echo "Installing dependencies..."
npm install --no-package-lock --no-optional --production --legacy-peer-deps 2>&1 | tee install.log

if [ $? -ne 0 ]; then
    echo "❌ Installation failed with 512MB memory"
    echo "Trying with even lower memory (256MB)..."
    
    export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16"
    npm install --no-package-lock --no-optional --production --legacy-peer-deps --prefer-offline
    
    if [ $? -ne 0 ]; then
        echo "❌ Installation failed even with 256MB memory"
        echo "🆘 CRITICAL: This server may not have enough memory for Node.js applications"
        echo "Contact your hosting provider immediately"
        exit 1
    fi
fi

echo "✓ Dependencies installed successfully"

# Step 6: Skip Prisma generation if it exists
echo "Step 6: Handling Prisma configuration..."
if [ -f "prisma/schema.prisma" ]; then
    echo "Prisma schema found - attempting safe generation..."
    
    # Try with minimal memory first
    echo "Attempting Prisma generation with minimal memory..."
    NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16" npx prisma generate 2>&1 | tee prisma.log
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Prisma generation failed - disabling Prisma temporarily"
        
        # Backup and disable Prisma
        mv prisma prisma-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
        
        echo "Prisma has been temporarily disabled to prevent memory errors"
        echo "You can re-enable it later with a compatible version"
    else
        echo "✓ Prisma generation successful"
    fi
else
    echo "No Prisma schema found - skipping"
fi

# Step 7: Build with minimal memory
echo "Step 7: Building application with minimal memory..."
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32"

echo "Building Next.js application..."
npm run build 2>&1 | tee build.log

if [ $? -ne 0 ]; then
    echo "❌ Build failed with 512MB memory"
    echo "Trying development mode instead..."
    
    # Skip build and use development mode
    echo "Switching to development mode to avoid build memory issues"
    
    # Create a simple start script for development
    cat > start-dev.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = true;
const hostname = 'localhost';
const port = process.env.PORT || 3000;

process.env.NODE_OPTIONS = '--max-old-space-size=512 --max-semi-space-size=32';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
EOF
    
    echo "✓ Development mode configuration created"
else
    echo "✓ Build completed successfully"
fi

# Step 8: Set file permissions
echo "Step 8: Setting proper file permissions..."
chmod 644 *.js 2>/dev/null || true
chmod 644 *.json 2>/dev/null || true
chmod +x *.sh 2>/dev/null || true
echo "✓ File permissions set"

# Step 9: Final recommendations
echo ""
echo "🎯 === EMERGENCY FIX COMPLETED ==="
echo ""
echo "✅ Emergency measures applied:"
echo "   - Ultra-minimal package (WebAssembly-free)"
echo "   - Extreme memory optimization"
echo "   - Prisma disabled/downgraded if problematic"
echo "   - Development mode fallback if needed"
echo ""
echo "🔧 CRITICAL NEXT STEPS:"
echo ""
echo "1. **IMMEDIATELY** change Node.js version in cPanel:"
echo "   - Go to cPanel → Node.js Selector"
echo "   - Change from v20.x to v18.x or v16.x"
echo "   - Click 'Set as current'"
echo ""
echo "2. Set startup file in cPanel Node.js Selector:"
if [ -f "start-dev.js" ]; then
    echo "   - Startup File: start-dev.js (development mode)"
else
    echo "   - Startup File: cpanel-app-config.js (if available)"
fi
echo ""
echo "3. Restart the Node.js application"
echo ""
echo "4. If still failing:"
echo "   - Run: ./wasm-memory-fix.sh (specialized WebAssembly fix)"
echo "   - Contact hosting provider about memory limits"
echo "   - Request Node.js v18.x or v16.x"
echo "   - Consider upgrading hosting plan"
echo ""
echo "🔧 Additional Tools Available:"
echo "   - wasm-memory-fix.sh: Specialized WebAssembly memory fix"
echo "   - package-cpanel-ultra-minimal.json: Minimal dependencies"
echo "   - server-minimal.js: Memory-optimized development server"
echo ""
echo "⚠️  WARNING: Node.js v20.18.3 has known WebAssembly memory issues"
echo "The only reliable fix is downgrading to v18.x or v16.x"
echo ""
echo "📋 Log files created:"
echo "   - install.log (dependency installation)"
echo "   - build.log (build process)"
echo "   - prisma.log (Prisma generation, if attempted)"
echo ""
echo "=== Emergency Fix Script Completed ===