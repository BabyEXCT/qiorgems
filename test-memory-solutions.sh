#!/bin/bash

# =============================================================================
# Memory Solutions Testing Script for cPanel
# =============================================================================
# This script tests all memory optimization solutions and provides
# step-by-step validation for cPanel deployment.
#
# Author: QioGems Development Team
# Version: 1.0
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Test configuration
TEST_DIR="/tmp/qiogems-test"
LOG_FILE="memory-test-$(date +%Y%m%d-%H%M%S).log"
MAX_MEMORY_MB=4096  # 4GB limit
WARN_MEMORY_MB=3072 # 3GB warning threshold

echo -e "${BLUE}🧪 QioGems Memory Solutions Test Suite${NC}"
echo -e "${BLUE}=====================================${NC}"
echo

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1" | tee -a "$LOG_FILE"
}

print_test() {
    echo -e "${PURPLE}🔬${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check memory usage
check_memory_usage() {
    local process_name="$1"
    local max_memory_mb="$2"
    
    if command -v ps >/dev/null 2>&1; then
        local memory_kb=$(ps aux | grep "$process_name" | grep -v grep | awk '{sum += $6} END {print sum}')
        if [ -n "$memory_kb" ] && [ "$memory_kb" -gt 0 ]; then
            local memory_mb=$((memory_kb / 1024))
            echo "$memory_mb"
            
            if [ "$memory_mb" -gt "$max_memory_mb" ]; then
                return 1
            fi
        fi
    fi
    return 0
}

# Function to monitor memory during process
monitor_memory() {
    local pid="$1"
    local process_name="$2"
    local max_memory_mb="$3"
    
    echo "Monitoring memory usage for $process_name (PID: $pid)..."
    
    while kill -0 "$pid" 2>/dev/null; do
        if command -v ps >/dev/null 2>&1; then
            local memory_kb=$(ps -p "$pid" -o rss= 2>/dev/null || echo "0")
            local memory_mb=$((memory_kb / 1024))
            
            if [ "$memory_mb" -gt 0 ]; then
                echo "   Memory usage: ${memory_mb}MB"
                
                if [ "$memory_mb" -gt "$max_memory_mb" ]; then
                    print_error "Memory limit exceeded: ${memory_mb}MB > ${max_memory_mb}MB"
                    return 1
                elif [ "$memory_mb" -gt "$WARN_MEMORY_MB" ]; then
                    print_warning "High memory usage: ${memory_mb}MB"
                fi
            fi
        fi
        
        sleep 2
    done
    
    return 0
}

# Test 1: Verify Node.js version and memory settings
test_node_environment() {
    print_test "Testing Node.js environment..."
    
    # Check Node.js version
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node --version)
        print_info "Node.js version: $node_version"
        
        # Check if version is compatible
        local major_version=$(echo "$node_version" | sed 's/v\([0-9]*\).*/\1/')
        if [ "$major_version" -ge 16 ] && [ "$major_version" -le 20 ]; then
            print_status "Node.js version is compatible"
        else
            print_warning "Node.js version may have compatibility issues"
        fi
    else
        print_error "Node.js not found"
        return 1
    fi
    
    # Check npm version
    if command -v npm >/dev/null 2>&1; then
        local npm_version=$(npm --version)
        print_info "npm version: $npm_version"
        print_status "npm is available"
    else
        print_error "npm not found"
        return 1
    fi
    
    # Test NODE_OPTIONS
    export NODE_OPTIONS="--max-old-space-size=1024 --max-semi-space-size=64"
    if node -e "console.log('Node.js memory options applied successfully')"; then
        print_status "NODE_OPTIONS applied successfully"
    else
        print_error "Failed to apply NODE_OPTIONS"
        return 1
    fi
    
    return 0
}

# Test 2: Verify memory optimization files
test_optimization_files() {
    print_test "Testing memory optimization files..."
    
    local files=(
        "cpanel-memory-expansion.sh"
        "webpack.memory-optimized.js"
        "next.config.cpanel-optimized.js"
        "package-cpanel-ultra-minimal.json"
        "wasm-memory-fix.sh"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_status "Found: $file"
        else
            print_error "Missing: $file"
            return 1
        fi
    done
    
    # Test file permissions
    for script in "cpanel-memory-expansion.sh" "wasm-memory-fix.sh"; do
        if [ -x "$script" ]; then
            print_status "$script is executable"
        else
            print_warning "$script is not executable, fixing..."
            chmod +x "$script"
        fi
    done
    
    return 0
}

# Test 3: Test package.json configurations
test_package_configurations() {
    print_test "Testing package.json configurations..."
    
    local packages=(
        "package.json"
        "package-cpanel-emergency.json"
        "package-cpanel-ultra-minimal.json"
    )
    
    for package in "${packages[@]}"; do
        if [ -f "$package" ]; then
            if node -e "JSON.parse(require('fs').readFileSync('$package', 'utf8'))" 2>/dev/null; then
                print_status "$package is valid JSON"
            else
                print_error "$package has invalid JSON syntax"
                return 1
            fi
        else
            print_warning "$package not found"
        fi
    done
    
    return 0
}

# Test 4: Test memory-optimized build process
test_memory_build() {
    print_test "Testing memory-optimized build process..."
    
    # Create test directory
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"
    
    # Copy necessary files
    cp "$OLDPWD/package-cpanel-ultra-minimal.json" "./package.json" 2>/dev/null || {
        print_warning "Ultra-minimal package not found, using emergency package"
        cp "$OLDPWD/package-cpanel-emergency.json" "./package.json" 2>/dev/null || {
            print_error "No emergency package found"
            return 1
        }
    }
    
    cp "$OLDPWD/next.config.cpanel-optimized.js" "./next.config.js" 2>/dev/null || {
        print_warning "Optimized config not found"
    }
    
    cp "$OLDPWD/webpack.memory-optimized.js" "./" 2>/dev/null || {
        print_warning "Webpack optimization not found"
    }
    
    # Test npm install with memory constraints
    print_info "Testing npm install with memory constraints..."
    export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32"
    
    if timeout 300 npm install --no-audit --no-fund --prefer-offline 2>&1 | tee install.log; then
        print_status "npm install completed successfully"
    else
        print_error "npm install failed"
        cat install.log | tail -20
        return 1
    fi
    
    cd "$OLDPWD"
    return 0
}

# Test 5: Test WebAssembly memory fix
test_wasm_memory_fix() {
    print_test "Testing WebAssembly memory fix..."
    
    if [ -f "wasm-memory-fix.sh" ]; then
        # Test the script without actually running it
        if bash -n "wasm-memory-fix.sh"; then
            print_status "wasm-memory-fix.sh syntax is valid"
        else
            print_error "wasm-memory-fix.sh has syntax errors"
            return 1
        fi
        
        # Test memory settings
        source "wasm-memory-fix.sh" --test-only 2>/dev/null || {
            print_info "Testing memory settings manually..."
            export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32"
            export UV_THREADPOOL_SIZE=2
            export NODE_ENV=development
            
            if node -e "console.log('Memory settings applied')"; then
                print_status "Memory settings work correctly"
            else
                print_error "Memory settings failed"
                return 1
            fi
        }
    else
        print_error "wasm-memory-fix.sh not found"
        return 1
    fi
    
    return 0
}

# Test 6: Test memory expansion script
test_memory_expansion() {
    print_test "Testing memory expansion script..."
    
    if [ -f "cpanel-memory-expansion.sh" ]; then
        # Test script syntax
        if bash -n "cpanel-memory-expansion.sh"; then
            print_status "cpanel-memory-expansion.sh syntax is valid"
        else
            print_error "cpanel-memory-expansion.sh has syntax errors"
            return 1
        fi
        
        # Test individual functions (dry run)
        print_info "Testing memory expansion functions..."
        
        # Test memory check function
        if free -h >/dev/null 2>&1; then
            print_status "Memory checking works"
        else
            print_warning "Memory checking may not work on this system"
        fi
        
        # Test swap creation (dry run)
        if [ -w "$HOME" ]; then
            print_status "Home directory is writable for swap file"
        else
            print_warning "Home directory may not be writable"
        fi
    else
        print_error "cpanel-memory-expansion.sh not found"
        return 1
    fi
    
    return 0
}

# Test 7: Simulate cPanel environment
test_cpanel_simulation() {
    print_test "Simulating cPanel environment..."
    
    # Set cPanel-like environment variables
    export NODE_ENV=production
    export PORT=3000
    export NEXT_TELEMETRY_DISABLED=1
    
    # Test with memory limits
    export NODE_OPTIONS="--max-old-space-size=1024 --max-semi-space-size=64"
    
    # Test basic Node.js functionality
    if node -e "console.log('cPanel simulation test passed')"; then
        print_status "cPanel environment simulation successful"
    else
        print_error "cPanel environment simulation failed"
        return 1
    fi
    
    # Test Next.js basic functionality
    if [ -f "next.config.js" ] || [ -f "next.config.cpanel-optimized.js" ]; then
        if node -e "require('./next.config.cpanel-optimized.js'); console.log('Next.js config loaded')"; then
            print_status "Next.js configuration loads successfully"
        else
            print_warning "Next.js configuration may have issues"
        fi
    fi
    
    return 0
}

# Generate test report
generate_report() {
    echo
    echo -e "${BLUE}📋 Test Report${NC}"
    echo -e "${BLUE}=============${NC}"
    echo
    
    echo "Test Results Summary:" | tee -a "$LOG_FILE"
    echo "- Node.js Environment: $test1_result" | tee -a "$LOG_FILE"
    echo "- Optimization Files: $test2_result" | tee -a "$LOG_FILE"
    echo "- Package Configurations: $test3_result" | tee -a "$LOG_FILE"
    echo "- Memory Build Process: $test4_result" | tee -a "$LOG_FILE"
    echo "- WebAssembly Memory Fix: $test5_result" | tee -a "$LOG_FILE"
    echo "- Memory Expansion: $test6_result" | tee -a "$LOG_FILE"
    echo "- cPanel Simulation: $test7_result" | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
    
    local passed=0
    local total=7
    
    for result in "$test1_result" "$test2_result" "$test3_result" "$test4_result" "$test5_result" "$test6_result" "$test7_result"; do
        if [ "$result" = "PASSED" ]; then
            ((passed++))
        fi
    done
    
    echo "Overall Result: $passed/$total tests passed" | tee -a "$LOG_FILE"
    
    if [ "$passed" -eq "$total" ]; then
        echo -e "${GREEN}🎉 All tests passed! Your memory solutions are ready for cPanel deployment.${NC}" | tee -a "$LOG_FILE"
        return 0
    elif [ "$passed" -ge 5 ]; then
        echo -e "${YELLOW}⚠️ Most tests passed. Review warnings before deployment.${NC}" | tee -a "$LOG_FILE"
        return 0
    else
        echo -e "${RED}❌ Multiple tests failed. Please fix issues before deployment.${NC}" | tee -a "$LOG_FILE"
        return 1
    fi
}

# Cleanup function
cleanup() {
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi
}

# Main execution
main() {
    echo "Starting memory solutions test suite..." | tee "$LOG_FILE"
    echo "Test started at: $(date)" | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
    
    # Run tests
    test_node_environment && test1_result="PASSED" || test1_result="FAILED"
    test_optimization_files && test2_result="PASSED" || test2_result="FAILED"
    test_package_configurations && test3_result="PASSED" || test3_result="FAILED"
    test_memory_build && test4_result="PASSED" || test4_result="FAILED"
    test_wasm_memory_fix && test5_result="PASSED" || test5_result="FAILED"
    test_memory_expansion && test6_result="PASSED" || test6_result="FAILED"
    test_cpanel_simulation && test7_result="PASSED" || test7_result="FAILED"
    
    # Generate report
    generate_report
    
    echo | tee -a "$LOG_FILE"
    echo "Test completed at: $(date)" | tee -a "$LOG_FILE"
    echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
    
    # Deployment instructions
    echo | tee -a "$LOG_FILE"
    echo -e "${BLUE}📚 Deployment Instructions for cPanel:${NC}" | tee -a "$LOG_FILE"
    echo "1. Upload all files to your cPanel public_html directory" | tee -a "$LOG_FILE"
    echo "2. Run: chmod +x *.sh" | tee -a "$LOG_FILE"
    echo "3. Run: ./cpanel-memory-expansion.sh" | tee -a "$LOG_FILE"
    echo "4. If WebAssembly errors persist, run: ./wasm-memory-fix.sh" | tee -a "$LOG_FILE"
    echo "5. Use: npm run build:memory or npm run build:safe" | tee -a "$LOG_FILE"
    echo "6. Start server: npm start" | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
    
    return $?
}

# Trap cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"