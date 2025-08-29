#!/bin/bash

# cPanel Node.js Application Startup Script
# This script ensures your Next.js application starts properly on cPanel

echo "=== cPanel Node.js Application Startup ==="
echo "Starting at: $(date)"

# Set Node.js version (adjust if needed)
export NODE_VERSION="20.18.3"
echo "Using Node.js version: $NODE_VERSION"

# Set memory optimization for Node.js
export NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=128"
echo "Node.js memory options: $NODE_OPTIONS"

# Navigate to application directory
APP_DIR="/home/$(whoami)/public_html"
echo "Application directory: $APP_DIR"
cd "$APP_DIR" || {
    echo "ERROR: Cannot access application directory: $APP_DIR"
    exit 1
}

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found in $APP_DIR"
    echo "Please ensure your application files are uploaded to the correct directory."
    exit 1
fi

# Check Node.js and npm installation
echo "Checking Node.js installation..."
node --version || {
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js through cPanel Node.js Selector"
    exit 1
}

npm --version || {
    echo "ERROR: npm is not available"
    echo "Please ensure npm is installed with Node.js"
    exit 1
}

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    
    # Try different package configurations based on availability
    if [ -f "package-cpanel-ultra-low-memory.json" ]; then
        echo "Using ultra-low memory package configuration..."
        cp package-cpanel-ultra-low-memory.json package.json
    elif [ -f "package-cpanel-low-memory.json" ]; then
        echo "Using low memory package configuration..."
        cp package-cpanel-low-memory.json package.json
    elif [ -f "package-cpanel-no-postinstall.json" ]; then
        echo "Using no-postinstall package configuration..."
        cp package-cpanel-no-postinstall.json package.json
    elif [ -f "package-cpanel.json" ]; then
        echo "Using cPanel-optimized package configuration..."
        cp package-cpanel.json package.json
    else
        echo "Using default package.json..."
    fi
    
    # Install with memory optimization
    NODE_OPTIONS="--max-old-space-size=2048" npm install --production --no-optional || {
        echo "ERROR: npm install failed"
        echo "Trying with reduced memory..."
        NODE_OPTIONS="--max-old-space-size=1024" npm install --production --no-optional || {
            echo "ERROR: npm install failed even with reduced memory"
            exit 1
        }
    }
else
    echo "Dependencies already installed."
fi

# Build the application if needed
if [ ! -d ".next" ]; then
    echo "Building Next.js application..."
    
    # Try building with memory optimization
    NODE_OPTIONS="--max-old-space-size=2048" npm run build || {
        echo "ERROR: Build failed with 2GB memory"
        echo "Trying with reduced memory..."
        NODE_OPTIONS="--max-old-space-size=1024" npm run build || {
            echo "ERROR: Build failed even with reduced memory"
            echo "Trying development mode..."
        }
    }
else
    echo "Application already built."
fi

# Generate Prisma client if needed
if [ -f "prisma/schema.prisma" ]; then
    echo "Generating Prisma client..."
    
    # Try with memory optimization
    NODE_OPTIONS="--max-old-space-size=1024 --max-semi-space-size=64" npx prisma generate || {
        echo "WARNING: Prisma generation failed, but continuing..."
    }
fi

# Kill any existing Node.js processes
echo "Stopping any existing Node.js processes..."
pkill -f "node.*next" 2>/dev/null || true
pkill -f "npm.*start" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Start the application
echo "Starting Next.js application..."

# Try different startup methods
if [ -f ".next/BUILD_ID" ]; then
    echo "Starting in production mode..."
    NODE_OPTIONS="--max-old-space-size=2048" npm start &
    APP_PID=$!
else
    echo "Starting in development mode..."
    NODE_OPTIONS="--max-old-space-size=2048" npm run dev &
    APP_PID=$!
fi

echo "Application started with PID: $APP_PID"

# Wait a moment and check if the process is still running
sleep 5

if kill -0 $APP_PID 2>/dev/null; then
    echo "✅ Application is running successfully!"
    echo "PID: $APP_PID"
    echo "You can now access your application through your domain."
    
    # Show process information
    echo "Process details:"
    ps aux | grep $APP_PID | grep -v grep
    
    echo ""
    echo "=== Startup Complete ==="
    echo "If you still see 503 errors, please:"
    echo "1. Check cPanel Error Logs"
    echo "2. Verify Node.js app is set to the correct directory"
    echo "3. Ensure the startup file is set to 'app.js' or 'server.js'"
    echo "4. Check if port 3000 is available or configure a different port"
else
    echo "❌ Application failed to start or crashed immediately"
    echo "Please check the error logs and try running the fix-cpanel-deployment.sh script"
    exit 1
fi

# Keep the script running to maintain the process
echo "Monitoring application..."
while kill -0 $APP_PID 2>/dev/null; do
    sleep 30
done

echo "Application process ended. Exiting."
exit 1