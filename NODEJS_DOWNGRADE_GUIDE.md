# Node.js Downgrade Guide for cPanel WebAssembly Memory Fix

## 🚨 Critical Issue
**WebAssembly.instantiate(): Out of memory** error on Node.js v20.18.3

## ⚠️ Root Cause
Node.js v20.x has known WebAssembly memory allocation issues that cause:
- Memory allocation failures even with 4GB available
- Edge runtime compilation errors
- Next.js development server crashes

## ✅ Recommended Solution: Node.js Downgrade

### Option 1: Node.js v18.20.4 (Recommended)
```bash
# In cPanel Node.js Selector
1. Go to cPanel → Software → Node.js Selector
2. Select your domain
3. Change Node.js version to: 18.20.4
4. Click "Set as Current"
5. Restart your application
```

### Option 2: Node.js v16.20.2 (Most Stable)
```bash
# In cPanel Node.js Selector
1. Go to cPanel → Software → Node.js Selector
2. Select your domain
3. Change Node.js version to: 16.20.2
4. Click "Set as Current"
5. Restart your application
```

## 🔧 After Downgrade Steps

### 1. Clear Node Modules
```bash
rm -rf node_modules
rm package-lock.json
```

### 2. Use Compatible Package Configuration
```bash
# For Node.js v18.x
cp package-cpanel-emergency.json package.json

# For Node.js v16.x
cp package-cpanel.json package.json
```

### 3. Reinstall Dependencies
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### 4. Test Application
```bash
npm run dev
```

## 🎯 Expected Results After Downgrade

✅ **Node.js v18.x:**
- WebAssembly memory issues resolved
- Next.js development server starts successfully
- No "Out of memory" errors
- Compatible with modern React/Next.js features

✅ **Node.js v16.x:**
- Maximum stability
- All WebAssembly issues resolved
- Proven compatibility with cPanel hosting
- Recommended for production deployments

## 🚫 Why Node.js v20.x Fails

1. **Memory Allocation Changes**: v20.x changed WebAssembly memory allocation
2. **Edge Runtime Issues**: Next.js edge runtime incompatible with v20.x memory limits
3. **cPanel LVE Limits**: 4GB memory limit conflicts with v20.x allocation strategy
4. **WebAssembly Instance Creation**: Fails even with sufficient available memory

## 📞 Contact Hosting Provider If:

- Node.js Selector doesn't show v18.x or v16.x options
- Downgrade option is not available
- You need assistance with version management
- LVE memory limits need adjustment

## 🔍 Verification Commands

```bash
# Check Node.js version
node --version

# Check memory limits
ulimit -a

# Test WebAssembly support
node -e "console.log(typeof WebAssembly)"

# Check Next.js compatibility
npx next info
```

## 📋 Troubleshooting

### If downgrade is not possible:
1. Use `./wasm-memory-fix.sh` (temporary workaround)
2. Apply `package-cpanel-ultra-minimal.json` (removes WebAssembly dependencies)
3. Use `server-minimal.js` (WebAssembly-free development server)
4. Contact hosting provider for Node.js version management

### If errors persist after downgrade:
1. Clear all caches: `npm cache clean --force`
2. Remove node_modules completely
3. Use legacy peer deps: `npm install --legacy-peer-deps`
4. Check cPanel error logs for additional issues

---

**Note**: This downgrade is specifically for resolving WebAssembly memory allocation errors on cPanel hosting with Node.js v20.x. The issue is well-documented and affects many Next.js applications on shared hosting environments.