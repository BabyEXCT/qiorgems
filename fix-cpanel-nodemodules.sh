#!/bin/bash

# Fix CloudLinux NodeJS Selector node_modules conflict
# Run this script in your cPanel NodeJS Selector terminal

echo "=== CloudLinux NodeJS Selector Fix ==="
echo "Resolving node_modules symlink conflict..."

# Check current directory
echo "\nCurrent directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Remove any existing node_modules (physical folder or broken symlink)
echo "\n1. Removing any existing node_modules..."
if [ -e "node_modules" ] || [ -L "node_modules" ]; then
    echo "Found node_modules, removing..."
    rm -rf node_modules
    echo "✅ node_modules removed"
else
    echo "✅ No node_modules found (good!)"
fi

# Remove package-lock.json if it exists
echo "\n2. Removing package-lock.json..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✅ package-lock.json removed"
else
    echo "✅ No package-lock.json found"
fi

# Clear npm cache
echo "\n3. Clearing npm cache..."
npm cache clean --force
echo "✅ npm cache cleared"

# Check if we're in a NodeJS Selector environment
echo "\n4. Checking NodeJS Selector environment..."
if [ -n "$NODEJS_VERSION" ]; then
    echo "✅ NodeJS Selector environment detected"
    echo "Node.js version: $NODEJS_VERSION"
else
    echo "⚠️  NodeJS Selector environment variables not found"
    echo "Make sure you're running this in NodeJS Selector terminal"
fi

# Try to install dependencies using NodeJS Selector's npm
echo "\n5. Installing dependencies..."
echo "This will create the proper symlink automatically"

# Use the cPanel-optimized package.json if available
if [ -f "package-cpanel.json" ]; then
    echo "Using cPanel-optimized package.json..."
    cp package.json package-original.json
    cp package-cpanel.json package.json
fi

# Install core dependencies first
echo "Installing core dependencies..."
npm install --no-package-lock next@15.4.6 react@19.1.0 react-dom@19.1.0

if [ $? -eq 0 ]; then
    echo "✅ Core dependencies installed"
    
    # Install remaining dependencies
    echo "Installing remaining dependencies..."
    npm install --no-package-lock
    
    if [ $? -eq 0 ]; then
        echo "✅ All dependencies installed successfully"
        
        # Check if node_modules is now a symlink
        if [ -L "node_modules" ]; then
            echo "✅ node_modules is now a proper symlink"
            echo "Symlink target: $(readlink node_modules)"
        else
            echo "❌ node_modules is not a symlink - this may cause issues"
        fi
        
        # Generate Prisma client
        echo "\n6. Generating Prisma client..."
        npx prisma generate
        
        # Build the application
        echo "\n7. Building application..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "\n✅ SUCCESS! Application is ready for deployment"
            echo "\nNext steps:"
            echo "1. Set environment variables in NodeJS Selector"
            echo "2. Restart the application"
            echo "3. Test your application URL"
        else
            echo "\n❌ Build failed - check error messages above"
        fi
    else
        echo "❌ Dependency installation failed"
        echo "\nTrying with yarn as fallback..."
        npm install -g yarn
        yarn install
    fi
else
    echo "❌ Core dependency installation failed"
    echo "\nTroubleshooting suggestions:"
    echo "1. Check Node.js version compatibility"
    echo "2. Verify you're in NodeJS Selector terminal"
    echo "3. Contact hosting support for CloudLinux issues"
fi

echo "\n=== Fix Complete ==="