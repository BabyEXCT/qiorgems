#!/bin/bash

# cPanel Node.js Deployment Fix Script
# This script resolves the "Cannot find module 'next'" error

echo "=== cPanel Node.js Deployment Fix ==="
echo "Fixing missing dependencies issue..."

# Step 1: Clean up any existing installations
echo "Step 1: Cleaning up existing installations..."
rm -rf node_modules
rm -f package-lock.json
rm -rf .next

# Step 2: Clear npm cache
echo "Step 2: Clearing npm cache..."
npm cache clean --force

# Step 3: Use the cPanel-optimized package.json
echo "Step 3: Using cPanel-optimized package.json..."
if [ -f "package-cpanel.json" ]; then
    cp package.json package-original.json
    cp package-cpanel.json package.json
    echo "✓ Switched to cPanel-optimized package.json"
else
    echo "⚠ Warning: package-cpanel.json not found, using original package.json"
fi

# Step 4: Install dependencies with cPanel-optimized package.json (no postinstall)
echo "Step 4: Installing dependencies..."
if [ -f "package-cpanel-no-postinstall.json" ]; then
    echo "Using cPanel-optimized package.json without postinstall script..."
    cp package-cpanel-no-postinstall.json package.json
    npm install --no-package-lock --legacy-peer-deps
elif [ -f "package-cpanel-low-memory.json" ]; then
    echo "Using package-cpanel-low-memory.json for low-memory environments..."
    cp package-cpanel-low-memory.json package.json
    npm install --no-package-lock --legacy-peer-deps
elif [ -f "package-cpanel.json" ]; then
    echo "Using cPanel-optimized package.json..."
    cp package-cpanel.json package.json
    npm install --no-package-lock --legacy-peer-deps
else
    echo "Using default package.json..."
    npm install --no-package-lock --legacy-peer-deps
fi

# Step 5: Ensure Prisma CLI is available and generate client
echo "Step 5: Ensuring Prisma CLI is available..."

# Check Node.js version first
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

# Ensure Prisma CLI is installed locally
echo "Installing Prisma CLI locally..."
npm install --no-package-lock prisma@^4.16.2

# Add node_modules/.bin to PATH for this session
export PATH="$PWD/node_modules/.bin:$PATH"

# Verify Prisma CLI is available
if command -v prisma >/dev/null 2>&1; then
    echo "✓ Prisma CLI is available"
else
    echo "⚠ Prisma CLI not found in PATH, using npx..."
fi

# Try multiple approaches for Prisma generation with memory optimization
echo "Attempting Prisma client generation with memory optimization..."

# Method 1: Try with increased Node.js memory limit
echo "Trying with increased memory limit..."
if NODE_OPTIONS="--max-old-space-size=4096" npx prisma generate; then
    echo "✓ Prisma client generated successfully with memory optimization"
else
    echo "⚠ Memory-optimized generation failed, trying alternative methods..."
    
    # Method 2: Clear Prisma cache and try again
    echo "Clearing Prisma cache..."
    rm -rf node_modules/.prisma
    rm -rf node_modules/@prisma
    
    # Method 3: Try with even higher memory limit
    echo "Trying with higher memory limit (8GB)..."
    if NODE_OPTIONS="--max-old-space-size=8192" npx prisma generate; then
        echo "✓ Prisma client generated with high memory limit"
    else
        echo "⚠ High memory generation failed, reinstalling Prisma..."
        
        # Method 4: Reinstall Prisma packages with lower memory version
         echo "Reinstalling Prisma packages with lower memory requirements..."
         npm uninstall @prisma/client prisma
         npm install --no-package-lock @prisma/client@^3.15.2 prisma@^3.15.2
        
        # Method 5: Try generation with memory optimization after reinstall
        echo "Trying generation with memory optimization after reinstall..."
        if NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=512" npx prisma generate; then
            echo "✓ Prisma client generated successfully after reinstall with memory optimization"
        else
            echo "❌ Prisma generation still failing. WebAssembly memory error detected."
            echo "Possible solutions:"
            echo "1. Contact hosting provider to increase memory limits"
            echo "2. Use Node.js 16.x instead of 20.x (better WASM compatibility)"
            echo "3. Consider using Prisma v3.x for lower memory usage"
            echo "4. Check server memory availability: free -h"
            echo "5. Database connection in .env file"
            echo "6. Prisma schema syntax in prisma/schema.prisma"
        fi
    fi
fi

# Step 6: Ensure Next.js CLI is available
echo "Step 6: Ensuring Next.js CLI is available..."

# Install Next.js locally if not present
if ! command -v next &> /dev/null && ! [ -f "node_modules/.bin/next" ]; then
    echo "Installing Next.js CLI locally..."
    npm install --no-package-lock next@^13.5.0
fi

# Export node_modules/.bin to PATH for Next.js CLI
export PATH="$PWD/node_modules/.bin:$PATH"
echo "✓ Next.js CLI path exported"

# Verify Next.js CLI is available
if command -v next &> /dev/null || [ -f "node_modules/.bin/next" ]; then
    echo "✓ Next.js CLI is available"
else
    echo "⚠️ Next.js CLI not found, but proceeding with build..."
fi

# Step 7: Build the application
echo "Step 7: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Deployment fix completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your Node.js application in cPanel NodeJS Selector"
    echo "2. Check the application logs for any remaining errors"
    echo "3. Test your application URL"
else
    echo "❌ Build failed. Please check the error messages above."
    echo "You may need to:"
    echo "1. Check Node.js version compatibility (use 16.x or 18.x)"
    echo "2. Verify database configuration"
    echo "3. Contact your hosting provider for support"
fi

echo ""
echo "=== Fix Script Completed ==="