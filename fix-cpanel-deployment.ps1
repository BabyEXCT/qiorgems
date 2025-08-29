# cPanel Node.js Deployment Fix Script (PowerShell)
# This script resolves the "Cannot find module 'next'" error

Write-Host "=== cPanel Node.js Deployment Fix ===" -ForegroundColor Green
Write-Host "Fixing missing dependencies issue..." -ForegroundColor Yellow

# Step 1: Clean up any existing installations
Write-Host "Step 1: Cleaning up existing installations..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Removed .next build folder" -ForegroundColor Green
}

# Step 2: Clear npm cache
Write-Host "Step 2: Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Step 3: Use the cPanel-optimized package.json
Write-Host "Step 3: Using cPanel-optimized package.json..." -ForegroundColor Cyan
if (Test-Path "package-cpanel.json") {
    Copy-Item "package.json" "package-original.json"
    Copy-Item "package-cpanel.json" "package.json"
    Write-Host "✓ Switched to cPanel-optimized package.json" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: package-cpanel.json not found, using original package.json" -ForegroundColor Yellow
}

# Step 4: Install dependencies with specific flags for cPanel
Write-Host "Step 4: Installing dependencies..." -ForegroundColor Cyan
$installResult = npm install --no-package-lock --legacy-peer-deps --no-optional

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed. Trying alternative approach..." -ForegroundColor Red
    
    # Alternative: Install core dependencies first
    Write-Host "Installing core dependencies individually..." -ForegroundColor Yellow
    npm install --no-package-lock next@15.4.6
    npm install --no-package-lock react@19.1.0 react-dom@19.1.0
    npm install --no-package-lock @prisma/client
    npm install --no-package-lock prisma
    npm install --no-package-lock next-auth
    
    # Then install remaining dependencies
    npm install --no-package-lock --legacy-peer-deps
}

# Step 5: Generate Prisma client
Write-Host "Step 5: Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

# Step 6: Build the application
Write-Host "Step 6: Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment fix completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Upload your project files to cPanel (excluding node_modules)" -ForegroundColor White
    Write-Host "2. Run the bash version of this script on the cPanel server" -ForegroundColor White
    Write-Host "3. Restart your Node.js application in cPanel NodeJS Selector" -ForegroundColor White
    Write-Host "4. Check the application logs for any remaining errors" -ForegroundColor White
    Write-Host "5. Test your application URL" -ForegroundColor White
} else {
    Write-Host "❌ Build failed. Please check the error messages above." -ForegroundColor Red
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "1. Check Node.js version compatibility (use 16.x or 18.x)" -ForegroundColor White
    Write-Host "2. Verify database configuration" -ForegroundColor White
    Write-Host "3. Contact your hosting provider for support" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Fix Script Completed ===" -ForegroundColor Green