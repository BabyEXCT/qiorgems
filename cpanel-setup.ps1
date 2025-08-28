# CloudLinux NodeJS Selector Setup Script (PowerShell)
# Run this script locally to prepare for cPanel deployment

Write-Host "=== QioGems cPanel Deployment Preparation ===" -ForegroundColor Green
Write-Host "Preparing project for CloudLinux NodeJS Selector..." -ForegroundColor Yellow

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: package.json not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory." -ForegroundColor Red
    exit 1
}

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "1. Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "1. No node_modules folder found (good!)" -ForegroundColor Green
}

# Remove package-lock.json to prevent CloudLinux conflicts
if (Test-Path "package-lock.json") {
    Write-Host "1.1. Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item "package-lock.json"
    Write-Host "✅ package-lock.json removed" -ForegroundColor Green
} else {
    Write-Host "1.1. No package-lock.json found" -ForegroundColor Green
}

# Remove .next if it exists
if (Test-Path ".next") {
    Write-Host "2. Removing .next build cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ .next removed" -ForegroundColor Green
} else {
    Write-Host "2. No .next folder found" -ForegroundColor Green
}

# Check required files
Write-Host "3. Checking required files..." -ForegroundColor Yellow
$requiredFiles = @("server.js", "package.json", ".cpanelignore", "CPANEL_DEPLOYMENT.md")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file missing" -ForegroundColor Red
    }
}

# Create deployment package
Write-Host "4. Creating deployment package..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$packageName = "qiogems_cpanel_$timestamp.zip"

# Files to exclude from deployment
$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    "*.log",
    ".env.local",
    ".env.development.local",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*"
)

# Create zip file (requires PowerShell 5.0+)
try {
    $compress = @{
        Path = Get-ChildItem -Path "." -Exclude $excludePatterns
        CompressionLevel = "Optimal"
        DestinationPath = $packageName
    }
    Compress-Archive @compress -Force
    Write-Host "✅ Deployment package created: $packageName" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create deployment package: $($_.Exception.Message)" -ForegroundColor Red
}

# Display deployment checklist
Write-Host "`n=== Deployment Checklist ===" -ForegroundColor Cyan
Write-Host "Before uploading to cPanel:" -ForegroundColor Yellow
Write-Host "□ Upload $packageName to cPanel File Manager" -ForegroundColor White
Write-Host "□ Extract files in your domain directory" -ForegroundColor White
Write-Host "□ Create Node.js app in NodeJS Selector" -ForegroundColor White
Write-Host "□ Set startup file to: server.js" -ForegroundColor White
Write-Host "□ Run the setup script: bash cpanel-setup.sh" -ForegroundColor White
Write-Host "□ Set environment variables" -ForegroundColor White
Write-Host "□ Test the application" -ForegroundColor White

Write-Host "`n=== Environment Variables Needed ===" -ForegroundColor Cyan
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "NEXTAUTH_SECRET=your-secret-here" -ForegroundColor White
Write-Host "NEXTAUTH_URL=https://yourdomain.com" -ForegroundColor White
Write-Host "DATABASE_URL=your-database-connection-string" -ForegroundColor White

Write-Host "`n✅ Preparation complete!" -ForegroundColor Green
Write-Host "Follow the CPANEL_DEPLOYMENT.md guide for detailed instructions." -ForegroundColor Yellow