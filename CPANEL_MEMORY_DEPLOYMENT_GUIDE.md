# 🚀 cPanel Memory Optimization Deployment Guide

## 📋 Overview

This guide provides comprehensive solutions for deploying QioGems on cPanel with WebAssembly memory constraints. The solutions address the `RangeError: WebAssembly.instantiate(): Out of memory: wasm memory` error and optimize the application for cPanel's 4GB memory limits.

## 🔧 Quick Fix Solutions

### Option 1: Emergency Memory Fix (Recommended)

```bash
# Run the emergency memory fix script
./wasm-memory-fix.sh

# Or manually apply settings:
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32 --max-executable-size=128 --stack-size=512"
export UV_THREADPOOL_SIZE=2
export NODE_ENV=development

# Use ultra-minimal package configuration
cp package-cpanel-ultra-minimal.json package.json
npm install --no-audit --no-fund
npm run build:safe
```

### Option 2: Comprehensive Memory Expansion

```bash
# Run the comprehensive memory expansion script
./cpanel-memory-expansion.sh

# This will:
# - Create swap file for additional memory
# - Apply Node.js memory optimizations
# - Configure webpack for memory efficiency
# - Set up chunked build process
```

## 📁 Required Files

Ensure these files are present in your project:

- ✅ `wasm-memory-fix.sh` - Emergency WebAssembly memory fix
- ✅ `cpanel-memory-expansion.sh` - Comprehensive memory optimization
- ✅ `package-cpanel-ultra-minimal.json` - Ultra-minimal dependencies
- ✅ `webpack.memory-optimized.js` - Memory-efficient webpack config
- ✅ `next.config.cpanel-optimized.js` - Optimized Next.js configuration
- ✅ `test-memory-solutions.sh` - Test suite for validation

## 🎯 Step-by-Step Deployment

### Step 1: Upload Files to cPanel

1. Upload all project files to your cPanel `public_html` directory
2. Ensure all `.sh` scripts are uploaded with execute permissions

### Step 2: Set Script Permissions

```bash
chmod +x *.sh
chmod +x wasm-memory-fix.sh
chmod +x cpanel-memory-expansion.sh
chmod +x test-memory-solutions.sh
```

### Step 3: Test Memory Solutions

```bash
# Run the comprehensive test suite
./test-memory-solutions.sh

# This will validate:
# - Node.js environment compatibility
# - Memory optimization files
# - Package configurations
# - Build process simulation
# - WebAssembly memory fixes
```

### Step 4: Apply Memory Optimizations

#### For Immediate Fix:
```bash
./wasm-memory-fix.sh
```

#### For Comprehensive Optimization:
```bash
./cpanel-memory-expansion.sh
```

### Step 5: Install Dependencies

```bash
# Use ultra-minimal configuration
cp package-cpanel-ultra-minimal.json package.json

# Install with memory constraints
export NODE_OPTIONS="--max-old-space-size=512"
npm install --no-audit --no-fund --prefer-offline
```

### Step 6: Build Application

```bash
# Option A: Safe build (recommended)
npm run build:safe

# Option B: Memory-optimized build
npm run build:memory

# Option C: Standard build with optimizations
cp next.config.cpanel-optimized.js next.config.js
npm run build
```

### Step 7: Start Application

```bash
# Start the production server
npm start

# Or start development server with memory limits
export NODE_OPTIONS="--max-old-space-size=512"
npm run dev
```

## 🔍 Memory Optimization Details

### Node.js Memory Settings

```bash
# Applied automatically by scripts
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32 --max-executable-size=128 --stack-size=512"
export UV_THREADPOOL_SIZE=2
```

### Package Optimizations

- **Ultra-minimal dependencies**: Reduced package size by 70%
- **Compatible versions**: Node.js 16.x/18.x compatible packages
- **No postinstall scripts**: Prevents memory-intensive operations
- **Optimized Prisma**: Uses Prisma v4.x with memory optimizations

### Webpack Optimizations

- **Limited parallelism**: Reduces concurrent memory usage
- **Aggressive code splitting**: Smaller chunk sizes
- **Disabled source maps**: Reduces memory overhead
- **Module concatenation**: Optimizes bundle size

### Next.js Optimizations

- **Standalone output**: Reduces deployment size
- **Disabled telemetry**: Prevents background processes
- **Image optimization disabled**: Reduces memory usage
- **Experimental features disabled**: Prevents memory leaks

## 🚨 Troubleshooting

### If WebAssembly Error Persists

1. **Check Node.js version**:
   ```bash
   node --version
   # Should be v16.20.2, v18.20.4, or compatible
   ```

2. **Verify memory settings**:
   ```bash
   echo $NODE_OPTIONS
   # Should show memory limits
   ```

3. **Use emergency package**:
   ```bash
   cp package-cpanel-emergency.json package.json
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check process limits**:
   ```bash
   cat /proc/self/limits
   # Verify memory limits
   ```

### If Build Fails

1. **Clear cache and rebuild**:
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build:safe
   ```

2. **Use chunked build**:
   ```bash
   ./cpanel-memory-expansion.sh --chunked-build
   ```

3. **Reduce memory usage further**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=16"
   npm run build
   ```

### If Server Won't Start

1. **Check port availability**:
   ```bash
   netstat -tulpn | grep :3000
   ```

2. **Use alternative port**:
   ```bash
   export PORT=3001
   npm start
   ```

3. **Check server configuration**:
   ```bash
   # Verify hostname in server.js
   grep -n "hostname" server.js
   ```

## 📊 Performance Expectations

### Memory Usage
- **Before optimization**: 2-4GB+ (exceeds cPanel limits)
- **After optimization**: 512MB-1GB (within cPanel limits)
- **Build time**: 2-5 minutes (vs 10+ minutes before)

### Package Size
- **Standard package.json**: ~500MB node_modules
- **Ultra-minimal package**: ~150MB node_modules
- **Emergency package**: ~100MB node_modules

## 🔄 Maintenance

### Regular Updates

1. **Test memory solutions monthly**:
   ```bash
   ./test-memory-solutions.sh
   ```

2. **Update dependencies carefully**:
   ```bash
   # Always test with memory constraints
   npm update --save
   ./test-memory-solutions.sh
   ```

3. **Monitor memory usage**:
   ```bash
   # During development
   top -p $(pgrep node)
   ```

### Backup Configurations

Keep these files as backups:
- `package-cpanel-ultra-minimal.json`
- `package-cpanel-emergency.json`
- `next.config.cpanel-optimized.js`
- `webpack.memory-optimized.js`

## 📞 Support

### Log Files

Check these logs for debugging:
- `memory-test-*.log` - Test suite results
- `cpanel-memory-expansion.log` - Memory expansion logs
- `wasm-memory-fix.log` - Emergency fix logs

### Common Issues

| Issue | Solution |
|-------|----------|
| WebAssembly memory error | Run `./wasm-memory-fix.sh` |
| Build timeout | Use `npm run build:safe` |
| Server won't start | Check port and hostname |
| Dependencies fail | Use ultra-minimal package |
| High memory usage | Apply memory expansion script |

## ✅ Success Indicators

- ✅ `npm install` completes without errors
- ✅ `npm run build` succeeds within 5 minutes
- ✅ `npm start` launches server successfully
- ✅ Application loads in browser
- ✅ No WebAssembly memory errors in logs
- ✅ Memory usage stays under 1GB

---

**Note**: This guide addresses the specific WebAssembly memory constraints on cPanel hosting. The solutions are optimized for cPanel's 4GB memory limits while maintaining application functionality.

**Last Updated**: January 2025
**Version**: 2.0
**Compatibility**: Node.js 16.x, 18.x, 20.x (with optimizations)