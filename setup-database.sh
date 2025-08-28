#!/bin/bash

# Database Setup Script for QioGems cPanel Deployment
# This script will create all necessary database tables using Prisma migrations

echo "=== QioGems Database Setup ==="
echo "Setting up database tables..."

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "Error: npm/npx not found. Please install Node.js first."
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate Prisma client"
    exit 1
fi

# Deploy migrations to create tables
echo "Deploying database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "Error: Failed to deploy migrations"
    echo "Trying to push schema directly..."
    npx prisma db push
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to push schema. Please check your database connection."
        exit 1
    fi
fi

# Verify tables were created
echo "Verifying database setup..."
npx prisma db pull

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo "Tables created:"
    echo "  - User"
    echo "  - Account"
    echo "  - Session"
    echo "  - VerificationToken"
    echo "  - Category"
    echo "  - Material"
    echo "  - Product"
    echo "  - Order"
    echo "  - OrderItem"
    echo "  - Voucher"
    echo "  - Cart"
    echo "  - CartItem"
    echo "  - Wishlist"
    echo "  - WishlistItem"
    echo "  - Return"
    echo "  - ReturnItem"
else
    echo "❌ Database verification failed"
    exit 1
fi

# Optional: Seed the database with initial data
read -p "Do you want to seed the database with initial data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    node seed.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully!"
    else
        echo "⚠️  Seeding failed, but tables are created"
    fi
fi

echo "=== Database Setup Complete ==="
echo "You can now access your application with a fully configured database."