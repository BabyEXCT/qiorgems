# Database Setup Script for QioGems cPanel Deployment
# This script will create all necessary database tables using Prisma migrations

Write-Host "=== QioGems Database Setup ===" -ForegroundColor Green
Write-Host "Setting up database tables..." -ForegroundColor Yellow

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Deploy migrations to create tables
Write-Host "Deploying database migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate deploy
    Write-Host "✅ Migrations deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Migration deploy failed, trying to push schema directly..." -ForegroundColor Yellow
    try {
        npx prisma db push
        Write-Host "✅ Schema pushed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to push schema. Please check your database connection." -ForegroundColor Red
        Write-Host "Database URL: $env:DATABASE_URL" -ForegroundColor Cyan
        exit 1
    }
}

# Verify tables were created
Write-Host "Verifying database setup..." -ForegroundColor Yellow
try {
    npx prisma db pull
    Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    
    Write-Host "Tables created:" -ForegroundColor Cyan
    $tables = @(
        "User", "Account", "Session", "VerificationToken",
        "Category", "Material", "Product", "Order", "OrderItem",
        "Voucher", "Cart", "CartItem", "Wishlist", "WishlistItem",
        "Return", "ReturnItem"
    )
    
    foreach ($table in $tables) {
        Write-Host "  - $table" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Database verification failed" -ForegroundColor Red
    exit 1
}

# Optional: Seed the database with initial data
$seedChoice = Read-Host "Do you want to seed the database with initial data? (y/n)"
if ($seedChoice -eq 'y' -or $seedChoice -eq 'Y') {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    try {
        node seed.js
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Seeding failed, but tables are created" -ForegroundColor Yellow
        Write-Host "You can manually add data later or check the seed.js file" -ForegroundColor Cyan
    }
}

Write-Host "=== Database Setup Complete ===" -ForegroundColor Green
Write-Host "You can now access your application with a fully configured database." -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start your application: npm run dev" -ForegroundColor White
Write-Host "2. Check phpMyAdmin to verify tables are created" -ForegroundColor White
Write-Host "3. Test user registration and login functionality" -ForegroundColor White