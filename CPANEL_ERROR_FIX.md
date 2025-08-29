# cPanel "Cannot find module 'next'" Error - Quick Fix

## Error Description
```
Error: Cannot find module 'next'
Require stack:
- /home4/gems888/public_html/qiorgems/server.js
- /usr/local/lsws/fcgi-bin/lsnode.js
```

## Root Cause
This error occurs because Node.js dependencies (including Next.js) weren't properly installed on the cPanel server. The cPanel NodeJS Selector environment requires specific installation procedures.

## Quick Fix (2 Steps)

### Step 1: Local Preparation (Windows)
```powershell
# Navigate to your project folder
cd "E:\PROJECT CODING\qiogems"

# Run the fix script
.\fix-cpanel-deployment.ps1
```

### Step 2: Server Deployment (cPanel)
1. **Upload files** to cPanel (excluding node_modules)
2. **Open NodeJS Selector** in cPanel
3. **Open Terminal** for your Node.js app
4. **Run the fix script**:
   ```bash
   bash fix-cpanel-deployment.sh
   ```
5. **Restart** your Node.js application

## What the Fix Script Does

✅ **Cleans up** conflicting installations  
✅ **Uses** cPanel-optimized package.json  
✅ **Installs** dependencies with proper flags  
✅ **Generates** Prisma client  
✅ **Builds** the application  

## Alternative Manual Fix

If the automated script doesn't work:

```bash
# In cPanel NodeJS Selector terminal
rm -rf node_modules package-lock.json .next
npm cache clean --force

# Use cPanel-optimized package.json
cp package-cpanel.json package.json

# Install dependencies
npm install --no-package-lock --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# Build application
npm run build
```

## Verification

After running the fix:
1. ✅ No error messages during installation
2. ✅ `node_modules` folder exists (as symlink)
3. ✅ `.next` folder exists with build files
4. ✅ Application starts without "Cannot find module" errors

## Still Having Issues?

1. **Check Node.js version** - Use 16.x or 18.x in NodeJS Selector
2. **Verify file permissions** - Ensure files are readable
3. **Check error logs** - Look at NodeJS Selector logs for details
4. **Contact hosting support** - Some cPanel configurations may need provider assistance

## Files Created by This Fix

- `fix-cpanel-deployment.sh` - Server-side fix script
- `fix-cpanel-deployment.ps1` - Local preparation script
- `package-cpanel.json` - cPanel-optimized dependencies

For complete deployment instructions, see [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)