#!/bin/bash

# CloudLinux NodeJS Selector Setup Script
# Run this script in your cPanel NodeJS Selector terminal

echo "=== QioGems cPanel Deployment Setup ==="
echo "Starting CloudLinux NodeJS Selector configuration..."

# Check Node.js version
echo "\n1. Checking Node.js version..."
node --version
npm --version

# Clear any existing cache
echo "\n2. Clearing npm cache..."
npm cache clean --force

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "\nError: package.json not found!"
    echo "Make sure you've uploaded your project files."
    exit 1
fi

# Backup original package.json and use cPanel-optimized version if available
if [ -f "package-cpanel.json" ]; then
    echo "\n3. Using cPanel-optimized package.json..."
    cp package.json package-original.json
    cp package-cpanel.json package.json
    echo "Original package.json backed up as package-original.json"
fi

# Install dependencies step by step
echo "\n4. Installing core dependencies..."
npm install next@15.4.6 react@19.1.0 react-dom@19.1.0

if [ $? -ne 0 ]; then
    echo "\nCore dependency installation failed. Trying with yarn..."
    npm install -g yarn
    yarn add next@15.4.6 react@19.1.0 react-dom@19.1.0
fi

echo "\n5. Installing Prisma..."
npm install @prisma/client prisma

echo "\n6. Installing NextAuth..."
npm install next-auth

echo "\n7. Installing remaining dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "\nFull npm install failed. Trying yarn..."
    yarn install
fi

# Generate Prisma client
echo "\n8. Generating Prisma client..."
npx prisma generate

# Check if all critical packages are installed
echo "\n9. Verifying installation..."
if npm list next react react-dom @prisma/client next-auth > /dev/null 2>&1; then
    echo "✅ Core dependencies installed successfully!"
else
    echo "❌ Some core dependencies are missing. Check the logs above."
fi

# Build the application
echo "\n10. Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "\n✅ Build successful! Your application is ready."
    echo "\nNext steps:"
    echo "1. Set your environment variables in NodeJS Selector"
    echo "2. Restart the application"
    echo "3. Test your application URL"
else
    echo "\n❌ Build failed. Check the error messages above."
    echo "\nTroubleshooting:"
    echo "1. Verify all environment variables are set"
    echo "2. Check database connection"
    echo "3. Review the build logs for specific errors"
fi

echo "\n=== Setup Complete ==="