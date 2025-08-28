# cPanel Database Setup Guide for QioGems

This guide will walk you through creating and configuring a MySQL database in cPanel for your QioGems application.

## Prerequisites

- Access to cPanel hosting account
- Domain configured in cPanel
- Basic understanding of database concepts

## Step 1: Access MySQL Databases in cPanel

1. **Login to cPanel**
   - Go to your hosting provider's cPanel login page
   - Enter your cPanel username and password

2. **Navigate to MySQL Databases**
   - In the cPanel dashboard, look for the "Databases" section
   - Click on "MySQL Databases" or "MySQL Database Wizard"

## Step 2: Create a New Database

### Method 1: Using MySQL Database Wizard (Recommended for beginners)

1. **Click "MySQL Database Wizard"**
2. **Step 1 - Create Database:**
   - Enter database name: `qiogems_db` (or your preferred name)
   - Click "Next Step"

3. **Step 2 - Create Database User:**
   - Username: `qiogems_user` (or your preferred username)
   - Password: Create a strong password (save this securely)
   - Confirm password
   - Click "Create User"

4. **Step 3 - Add User to Database:**
   - Select "ALL PRIVILEGES" (recommended)
   - Or select specific privileges:
     - SELECT, INSERT, UPDATE, DELETE (basic operations)
     - CREATE, DROP, ALTER (schema modifications)
     - INDEX (performance optimization)
   - Click "Next Step"

5. **Step 4 - Complete Setup:**
   - Review the summary
   - Note down the full database name (usually prefixed with your cPanel username)
   - Click "Return to MySQL Databases"

### Method 2: Manual Database Creation

1. **Create Database:**
   - In "Create New Database" section
   - Enter database name: `qiogems_db`
   - Click "Create Database"

2. **Create Database User:**
   - In "MySQL Users" section
   - Username: `qiogems_user`
   - Password: Create strong password
   - Click "Create User"

3. **Add User to Database:**
   - In "Add User to Database" section
   - Select your user and database
   - Click "Add"
   - Grant ALL PRIVILEGES
   - Click "Make Changes"

## Step 3: Note Database Connection Details

After creating the database, note these details:

```
Database Host: localhost (or your hosting provider's database server)
Database Name: cpanelusername_qiogems_db
Database User: cpanelusername_qiogems_user
Database Password: [your_password]
Port: 3306 (default MySQL port)
```

**Important:** cPanel typically prefixes database and user names with your cPanel username.

## Step 4: Configure Environment Variables

Update your `.env` file with the database connection details:

```env
# Database Configuration
DATABASE_URL="mysql://cpanelusername_qiogems_user:your_password@localhost:3306/cpanelusername_qiogems_db"

# Alternative format for Prisma
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="cpanelusername_qiogems_db"
DB_USER="cpanelusername_qiogems_user"
DB_PASSWORD="your_password"
```

## Step 5: Test Database Connection

### Using phpMyAdmin (if available)

1. **Access phpMyAdmin:**
   - In cPanel, click "phpMyAdmin"
   - Login with your database credentials

2. **Verify Database:**
   - Check if your database appears in the left sidebar
   - Try creating a test table to verify permissions

### Using Command Line (if SSH access available)

```bash
mysql -h localhost -u cpanelusername_qiogems_user -p cpanelusername_qiogems_db
```

## Step 6: Initialize Database Schema

After deploying your application and configuring the database connection:

### Automated Setup (Recommended)

**For Linux/cPanel Terminal:**
```bash
chmod +x setup-database.sh
./setup-database.sh
```

**For Windows/Local Testing:**
```powershell
.\setup-database.ps1
```

### Manual Setup

If the automated scripts don't work, run these commands manually:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Deploy Migrations:**
   ```bash
   npx prisma migrate deploy
   ```
   
   If migrations fail, try pushing the schema directly:
   ```bash
   npx prisma db push
   ```

3. **Verify Tables Created:**
   ```bash
   npx prisma db pull
   ```

4. **Seed Database (optional):**
   ```bash
   node seed.js
   ```

### Expected Tables

After successful setup, your database should contain these tables:
- User, Account, Session, VerificationToken (Authentication)
- Category, Material, Product (Product Management)
- Order, OrderItem, Voucher (Order Management)
- Cart, CartItem, Wishlist, WishlistItem (Shopping)
- Return, ReturnItem (Returns Management)

## Security Best Practices

1. **Strong Passwords:**
   - Use complex passwords with letters, numbers, and symbols
   - Minimum 12 characters length

2. **Limited Privileges:**
   - Only grant necessary database privileges
   - Avoid using root database user for applications

3. **Regular Backups:**
   - Set up automatic database backups in cPanel
   - Download manual backups before major updates

4. **Environment Variables:**
   - Never commit database credentials to version control
   - Use environment variables for sensitive data

## Common Issues and Solutions

### Issue 1: "Access Denied" Error
**Solution:**
- Verify username and password are correct
- Check if user has proper privileges
- Ensure database name includes cPanel username prefix

### Issue 2: "Database Does Not Exist" Error
**Solution:**
- Verify database name is correct with prefix
- Check if database was created successfully
- Try recreating the database

### Issue 3: Connection Timeout
**Solution:**
- Check if database host is correct (usually 'localhost')
- Verify port number (default 3306)
- Contact hosting provider for server-specific settings

### Issue 4: Prisma Migration Fails
**Solution:**
- Ensure database user has CREATE, ALTER, DROP privileges
- Check if DATABASE_URL format is correct
- Try running migrations manually in phpMyAdmin

### Issue 5: MySQL Authentication Plugin Error
If you encounter `Unknown authentication plugin 'sha256_password'`, this is a common cPanel hosting issue.

**See detailed solutions in:** `MYSQL_AUTH_TROUBLESHOOTING.md`

**Quick fix:** Contact your hosting provider to change the database user's authentication plugin to `mysql_native_password`.

## Database Management Tools

1. **phpMyAdmin** (usually included with cPanel)
   - Web-based MySQL administration
   - Good for basic operations and queries

2. **MySQL Workbench** (external tool)
   - Advanced database design and administration
   - Requires remote database access

3. **Command Line** (if SSH available)
   - Direct MySQL command line access
   - Most powerful but requires SQL knowledge

## Backup and Restore

### Creating Backups

1. **Using cPanel Backup:**
   - Go to "Backup" in cPanel
   - Select "Download a MySQL Database Backup"
   - Choose your database

2. **Using phpMyAdmin:**
   - Select your database
   - Click "Export" tab
   - Choose export format (SQL recommended)
   - Click "Go"

### Restoring Backups

1. **Using phpMyAdmin:**
   - Select your database
   - Click "Import" tab
   - Choose your backup file
   - Click "Go"

## Next Steps

After setting up your database:

1. Update your application's environment variables
2. Deploy your application to cPanel
3. Run database migrations
4. Test your application's database connectivity
5. Set up regular backup schedules

## Support

If you encounter issues:

1. Check your hosting provider's documentation
2. Contact hosting support for cPanel-specific issues
3. Refer to MySQL documentation for database-specific problems
4. Check application logs for detailed error messages

---

**Note:** Database names and usernames in cPanel are typically prefixed with your cPanel username. Always use the full name when configuring your application.