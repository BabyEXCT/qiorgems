/*
  Warnings:

  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/

-- Create a default seller user if it doesn't exist
INSERT OR IGNORE INTO "User" (
    "id", 
    "email", 
    "username", 
    "password", 
    "role", 
    "firstName", 
    "lastName", 
    "createdAt", 
    "updatedAt"
) VALUES (
    'default_seller_id', 
    'seller@qiogems.com', 
    'seller', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAHAHUK', -- bcrypt hash for 'seller123'
    'SELLER', 
    'QioGems', 
    'Seller', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "images" TEXT NOT NULL,
    "categoryId" TEXT,
    "materialId" TEXT,
    "material" TEXT,
    "dimensions" TEXT,
    "gemstones" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Insert existing products with default seller ID
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "dimensions", "featured", "gemstones", "id", "images", "material", "materialId", "name", "price", "status", "stock", "updatedAt", "sellerId") 
SELECT "categoryId", "createdAt", "description", "dimensions", "featured", "gemstones", "id", "images", "material", "materialId", "name", "price", "status", "stock", "updatedAt", 'default_seller_id' FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
