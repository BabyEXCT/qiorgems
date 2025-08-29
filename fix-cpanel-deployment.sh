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
if [ -f "package-cpanel-ultra-low-memory.json" ]; then
    echo "Using package-cpanel-ultra-low-memory.json for ultra-low-memory environment (Prisma v2)..."
    cp package-cpanel-ultra-low-memory.json package.json
    npm install --no-package-lock --legacy-peer-deps
elif [ -f "package-cpanel-no-postinstall.json" ]; then
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

# Check system memory before proceeding
echo "Checking system memory..."
if command -v free >/dev/null 2>&1; then
    free -h
fi

# Try multiple approaches for Prisma generation with aggressive memory optimization
echo "Attempting Prisma client generation with aggressive memory optimization..."

# Method 1: Try with conservative memory settings first
echo "Method 1: Trying with conservative memory settings..."
if NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=256 --optimize-for-size" npx prisma generate; then
    echo "✓ Prisma client generated successfully with conservative settings"
else
    echo "⚠ Conservative generation failed, trying progressive optimization..."
    
    # Method 2: Clear all caches and temporary files
    echo "Method 2: Clearing all caches and temporary files..."
    rm -rf node_modules/.prisma
    rm -rf node_modules/@prisma
    rm -rf ~/.npm/_cacache
    rm -rf /tmp/prisma-*
    
    # Method 3: Force garbage collection and try with medium memory
    echo "Method 3: Trying with medium memory limit and GC optimization..."
    if NODE_OPTIONS="--max-old-space-size=3072 --max-semi-space-size=384 --expose-gc --optimize-for-size" node -e "if (global.gc) global.gc();" && NODE_OPTIONS="--max-old-space-size=3072 --max-semi-space-size=384 --optimize-for-size" npx prisma generate; then
        echo "✓ Prisma client generated with medium memory and GC"
    else
        echo "⚠ Medium memory generation failed, trying high memory..."
        
        # Method 4: Try with high memory limit
        echo "Method 4: Trying with high memory limit..."
        if NODE_OPTIONS="--max-old-space-size=6144 --max-semi-space-size=512 --optimize-for-size" npx prisma generate; then
            echo "✓ Prisma client generated with high memory limit"
        else
            echo "⚠ High memory generation failed, switching to Prisma v3..."
            
            # Method 5: Downgrade to Prisma v3 for lower memory usage
             echo "Method 5: Installing Prisma v3 for lower memory requirements..."
             npm uninstall @prisma/client prisma
             npm install --no-package-lock @prisma/client@^3.15.2 prisma@^3.15.2
            
            # Method 6: Try generation with Prisma v3 and memory optimization
            echo "Method 6: Trying generation with Prisma v3 and memory optimization..."
            if NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=256 --optimize-for-size" npx prisma generate; then
                echo "✓ Prisma client generated successfully with v3 and memory optimization"
            else
                echo "⚠ Prisma v3 generation failed, trying minimal memory approach..."
                
                # Method 7: Ultra-minimal memory approach
                 echo "Method 7: Trying ultra-minimal memory approach..."
                 if NODE_OPTIONS="--max-old-space-size=1536 --max-semi-space-size=128 --optimize-for-size --no-lazy" npx prisma generate; then
                     echo "✓ Prisma client generated with ultra-minimal memory"
                 else
                     echo "⚠ Ultra-minimal approach failed, trying Prisma v2 as last resort..."
                     
                     # Method 8: Last resort - Prisma v2.x for absolute minimal memory
                     echo "Method 8: Installing Prisma v2 for absolute minimal memory usage..."
                     npm uninstall @prisma/client prisma
                     npm install --no-package-lock @prisma/client@^2.30.3 prisma@^2.30.3
                     
                     # Method 9: Try generation with Prisma v2 and minimal memory
                     echo "Method 9: Trying generation with Prisma v2 and minimal memory..."
                     if NODE_OPTIONS="--max-old-space-size=1024 --max-semi-space-size=64 --optimize-for-size" npx prisma generate; then
                         echo "✓ Prisma client generated successfully with v2 and minimal memory"
                     else
                         echo "❌ All Prisma generation methods failed. WebAssembly memory error persists."
                         echo "Critical WebAssembly Memory Solutions:"
                         echo "1. IMMEDIATE: Contact hosting provider to increase memory limits"
                         echo "2. RECOMMENDED: Downgrade Node.js to v16.20.2 (better WASM compatibility)"
                         echo "3. CRITICAL: Current Node.js v20.18.3 has known WASM memory issues"
                         echo "4. SYSTEM: Check available memory: free -h"
                         echo "5. CONFIG: Verify database connection in .env file"
                         echo "6. SCHEMA: Check Prisma schema syntax in prisma/schema.prisma"
                         echo "7. HOSTING: Consider upgrading hosting plan for more memory"
                         echo "8. WORKAROUND: Generate Prisma client locally and upload generated files"
                         echo "9. ALTERNATIVE: Use package-cpanel-ultra-low-memory.json with Prisma v2"
                     fi
                 fi
            fi
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
    
    # Step 10: Configure application startup for cPanel
    echo "Step 10: Configuring application startup..."
    
    # Stop any existing Node.js processes
    echo "Stopping existing Node.js processes..."
    pkill -f "node.*next" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    sleep 2
    
    # Test application startup
    echo "Testing application startup..."
    
    # Check if cpanel-app-config.js exists
    if [ -f "cpanel-app-config.js" ]; then
        echo "✓ Found cpanel-app-config.js startup file"
        
        # Test startup with memory optimization
        echo "Testing application with memory optimization..."
        timeout 10 NODE_OPTIONS="--max-old-space-size=2048" node cpanel-app-config.js &
        STARTUP_PID=$!
        
        sleep 5
        
        if kill -0 $STARTUP_PID 2>/dev/null; then
            echo "✅ Application startup test successful!"
            kill $STARTUP_PID 2>/dev/null || true
        else
            echo "⚠ Application startup test failed, but continuing..."
        fi
    else
        echo "⚠ cpanel-app-config.js not found - using default startup"
    fi
    
    # Set proper file permissions
    echo "Setting file permissions..."
    chmod 644 *.js 2>/dev/null || true
    chmod 644 *.json 2>/dev/null || true
    chmod +x *.sh 2>/dev/null || true
    
    echo ""
    echo "🎯 IMPORTANT: To fix 503 Service Unavailable error:"
    echo ""
    echo "1. In cPanel Node.js Selector, set:"
    echo "   - Startup File: cpanel-app-config.js"
    echo "   - Application Mode: Production"
    echo "   - Node.js Version: 16.x or 18.x (avoid 20.18.3)"
    echo ""
    echo "2. Click 'Restart' in cPanel Node.js Selector"
    echo ""
    echo "3. If still getting 503 errors, run:"
    echo "   chmod +x start-cpanel-app.sh && ./start-cpanel-app.sh"
    echo ""
    echo "4. Check troubleshooting guide: CPANEL-503-TROUBLESHOOTING.md"
    echo ""
    echo "Next steps:"
    echo "1. Restart your Node.js application in cPanel NodeJS Selector"
    echo "2. Set startup file to 'cpanel-app-config.js'"
    echo "3. Check the application logs for any remaining errors"
    echo "4. Test your application URL"
    echo "5. If 503 error persists, follow the troubleshooting guide"
else
    echo "❌ Build failed. Please check the error messages above."
    echo "You may need to:"
    echo "1. Check Node.js version compatibility (use 16.x or 18.x)"
    echo "2. Verify database configuration"
    echo "3. Contact your hosting provider for support"
    echo "4. Try using package-cpanel-ultra-low-memory.json for memory issues"
fi

echo ""
echo "=== Fix Script Completed ==="
echo "📋 For 503 Service Unavailable errors, see: CPANEL-503-TROUBLESHOOTING.md"