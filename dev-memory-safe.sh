#!/bin/bash

# =============================================================================
# Memory-Safe Development Server for cPanel
# =============================================================================
# This script starts the development server with memory optimizations
# specifically for cPanel's 4GB memory limit.
#
# Addresses:
# - WebAssembly memory allocation errors
# - Non-standard NODE_ENV warnings
# - cPanel LVE memory limits
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Memory-Safe Development Server${NC}"
echo -e "${BLUE}=========================================${NC}"
echo

# Step 1: Set proper NODE_ENV for development
echo -e "${BLUE}Setting development environment...${NC}"
export NODE_ENV=development
echo -e "${GREEN}✓${NC} NODE_ENV set to development"

# Step 2: Apply memory constraints for cPanel
echo -e "${BLUE}Applying memory constraints...${NC}"
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32 --max-executable-size=128 --stack-size=512"
export UV_THREADPOOL_SIZE=2
export NEXT_TELEMETRY_DISABLED=1
echo -e "${GREEN}✓${NC} Memory limits applied (512MB max)"

# Step 3: Check if emergency config exists and use it
if [ -f "next.config.emergency.js" ]; then
    echo -e "${BLUE}Using emergency Next.js configuration...${NC}"
    cp next.config.emergency.js next.config.js
    echo -e "${GREEN}✓${NC} Emergency config applied"
else
    echo -e "${YELLOW}⚠${NC} Emergency config not found, using existing config"
fi

# Step 4: Check memory usage before starting
echo -e "${BLUE}Checking system memory...${NC}"
if command -v free >/dev/null 2>&1; then
    AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo -e "${GREEN}✓${NC} Available memory: ${AVAILABLE_MEM}MB"
    
    if [ "$AVAILABLE_MEM" -lt 1024 ]; then
        echo -e "${YELLOW}⚠${NC} Low memory detected, using ultra-minimal settings"
        export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16"
        export UV_THREADPOOL_SIZE=1
    fi
else
    echo -e "${YELLOW}⚠${NC} Cannot check memory, proceeding with default settings"
fi

# Step 5: Clear cache if it exists
echo -e "${BLUE}Clearing development cache...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "${GREEN}✓${NC} .next cache cleared"
fi

# Step 6: Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC} node_modules not found, installing dependencies..."
    
    # Use emergency package if available
    if [ -f "package.emergency.json" ]; then
        cp package.emergency.json package.json
        echo -e "${GREEN}✓${NC} Using emergency package configuration"
    fi
    
    npm install --no-audit --no-fund --prefer-offline
    echo -e "${GREEN}✓${NC} Dependencies installed"
fi

# Step 7: Start development server with monitoring
echo -e "${BLUE}Starting development server...${NC}"
echo -e "${GREEN}✓${NC} Server will start with memory monitoring"
echo -e "${YELLOW}Note:${NC} If WebAssembly errors occur, the server will restart with lower memory limits"
echo

# Function to monitor memory and restart if needed
start_with_fallback() {
    local attempt=1
    local max_attempts=3
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "${BLUE}Attempt $attempt/$max_attempts: Starting Next.js dev server...${NC}"
        
        # Start the server and capture output
        if npm run dev 2>&1 | tee dev.log; then
            echo -e "${GREEN}✓${NC} Development server started successfully"
            break
        else
            echo -e "${RED}✗${NC} Server failed to start (attempt $attempt)"
            
            # Check if it's a WebAssembly memory error
            if grep -q "WebAssembly.instantiate.*Out of memory" dev.log; then
                echo -e "${YELLOW}⚠${NC} WebAssembly memory error detected, reducing memory limits..."
                
                # Reduce memory limits progressively
                case $attempt in
                    1)
                        export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16"
                        export UV_THREADPOOL_SIZE=1
                        echo -e "${BLUE}Applied ultra-low memory settings${NC}"
                        ;;
                    2)
                        export NODE_OPTIONS="--max-old-space-size=128 --max-semi-space-size=8"
                        export UV_THREADPOOL_SIZE=1
                        echo -e "${BLUE}Applied extreme low memory settings${NC}"
                        
                        # Switch to emergency package if available
                        if [ -f "package.emergency.json" ]; then
                            cp package.emergency.json package.json
                            rm -rf node_modules package-lock.json
                            npm install --no-audit --no-fund
                            echo -e "${BLUE}Switched to emergency package${NC}"
                        fi
                        ;;
                esac
                
                # Clear cache before retry
                rm -rf .next
                
            elif grep -q "non-standard.*NODE_ENV" dev.log; then
                echo -e "${YELLOW}⚠${NC} NODE_ENV warning detected, fixing..."
                export NODE_ENV=development
                
            else
                echo -e "${RED}✗${NC} Unknown error, check dev.log for details"
                cat dev.log | tail -20
                break
            fi
            
            ((attempt++))
            
            if [ $attempt -le $max_attempts ]; then
                echo -e "${BLUE}Retrying in 3 seconds...${NC}"
                sleep 3
            fi
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}✗${NC} Failed to start development server after $max_attempts attempts"
        echo -e "${YELLOW}Try running: ./emergency-wasm-fix-immediate.sh${NC}"
        exit 1
    fi
}

# Start the server with fallback mechanism
start_with_fallback

echo -e "${GREEN}🎉 Development server is running!${NC}"
echo -e "${BLUE}Memory settings applied:${NC}"
echo "  NODE_OPTIONS: $NODE_OPTIONS"
echo "  UV_THREADPOOL_SIZE: $UV_THREADPOOL_SIZE"
echo "  NODE_ENV: $NODE_ENV"
echo
echo -e "${YELLOW}If you encounter issues, check dev.log for details${NC}"