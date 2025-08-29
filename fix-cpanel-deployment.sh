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

# Step 4: Install dependencies with specific flags for cPanel
echo "Step 4: Installing dependencies..."
npm install --no-package-lock --legacy-peer-deps --no-optional

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Trying alternative approach..."
    
    # Alternative: Install core dependencies first
    echo "Installing core dependencies individually..."
    npm install --no-package-lock next@15.4.6
    npm install --no-package-lock react@19.1.0 react-dom@19.1.0
    npm install --no-package-lock @prisma/client
    npm install --no-package-lock prisma
    npm install --no-package-lock next-auth
    
    # Then install remaining dependencies
    npm install --no-package-lock --legacy-peer-deps
fi

# Step 5: Generate Prisma client
echo "Step 5: Generating Prisma client..."
npx prisma generate

# Step 6: Build the application
echo "Step 6: Building application..."
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