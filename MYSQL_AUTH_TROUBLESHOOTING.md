# MySQL Authentication Plugin Troubleshooting Guide

## Problem
You're encountering the error: `Unknown authentication plugin 'sha256_password'`

This is a common issue with cPanel hosting environments where MySQL 8.0+ uses `sha256_password` or `caching_sha2_password` by default, but many applications (including Prisma) expect the older `mysql_native_password` authentication method.

## Solutions

### Solution 1: Contact Your Hosting Provider (Recommended)
Contact your hosting provider (cPanel support) and request them to:

1. **Change the authentication plugin** for your database user to `mysql_native_password`
2. **Reset the password** using the native authentication method

Provide them with:
- Database name: `gems888_qiogems_db`
- Username: `gems888_qiogems123`
- Request: Change authentication plugin to `mysql_native_password`

### Solution 2: Try Alternative Connection Parameters

Try these different connection string formats in your `.env` file:

```bash
# Option A: Disable SSL completely
DATABASE_URL="mysql://gems888_qiogems123:Qiogems123A!@localhost:3306/gems888_qiogems_db?ssl=false"

# Option B: Use socket connection (if available)
DATABASE_URL="mysql://gems888_qiogems123:Qiogems123A!@localhost/gems888_qiogems_db?socket=/tmp/mysql.sock"

# Option C: Force MySQL 5.7 compatibility
DATABASE_URL="mysql://gems888_qiogems123:Qiogems123A!@localhost:3306/gems888_qiogems_db?ssl=false&connect_timeout=300"
```

### Solution 3: Use phpMyAdmin for Initial Setup

As a workaround, you can manually create tables using phpMyAdmin:

1. **Export the schema** from your local SQLite database:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

2. **Generate SQL script** for MySQL:
   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > create_tables.sql
   ```

3. **Run the SQL script** in phpMyAdmin:
   - Open phpMyAdmin
   - Select your database `gems888_qiogems_db`
   - Go to "SQL" tab
   - Paste and execute the generated SQL

### Solution 4: Alternative Database Setup

If the authentication issue persists, consider:

1. **Create a new database user** in cPanel with a simpler password
2. **Use a different MySQL version** if your hosting provider offers options
3. **Switch to PostgreSQL** if available on your hosting plan

## Verification Steps

After implementing any solution:

1. **Test connection**:
   ```bash
   npx prisma db push
   ```

2. **Check tables in phpMyAdmin**:
   - Should see 16 tables created
   - Verify data can be inserted

3. **Run the application**:
   ```bash
   npm run dev
   ```

## Expected Tables

Your database should contain these 16 tables:
- User
- Account  
- Session
- VerificationToken
- Category
- Material
- Product
- Order
- OrderItem
- Voucher
- Cart
- CartItem
- Wishlist
- WishlistItem
- Return
- ReturnItem

## Next Steps

1. **Contact hosting provider** for authentication plugin change
2. **Try alternative connection strings** while waiting
3. **Use phpMyAdmin** as a temporary workaround
4. **Test thoroughly** once connection is established

## Common cPanel Hosting Providers

- **Hostgator**: Contact support via live chat
- **Bluehost**: Submit ticket requesting MySQL authentication change
- **GoDaddy**: Call technical support
- **SiteGround**: Use support ticket system
- **A2 Hosting**: Live chat or support ticket

Most providers can make this change within 24-48 hours.