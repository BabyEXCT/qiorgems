# CloudLinux NodeJS Selector Deployment Guide

## Prerequisites
- cPanel with CloudLinux NodeJS Selector support
- Node.js 16.x or 18.x available in NodeJS Selector
- Database access (MySQL/PostgreSQL)

## Step 1: Prepare Application for Upload

### Automated Preparation (Recommended)
**On Windows:**
```powershell
# Run the preparation script
.\cpanel-setup.ps1
```
This script will:
- Remove node_modules and .next folders
- Create a deployment package
- Show deployment checklist

### Manual Preparation
**Remove node_modules (IMPORTANT)**
```bash
# On Windows PowerShell
Remove-Item -Recurse -Force node_modules

# On Linux/Mac
rm -rf node_modules
```

### Files to Upload
Upload all files EXCEPT:
- `node_modules/` (will be managed by NodeJS Selector)
- `.next/` (will be built on server)
- `.env.local` (configure separately)

## Step 2: Upload to cPanel

1. **Compress your project** (excluding node_modules)
2. **Upload via File Manager** to your domain folder
3. **Extract the files**

## Step 3: Configure NodeJS Selector

### Create Node.js Application
1. Go to **cPanel → Software → NodeJS Selector**
2. Click **"Create App"**
3. Configure:
   - **Node.js Version**: 16.x or 18.x
   - **Application Mode**: Production
   - **Application Root**: `/public_html` (or your domain folder)
   - **Application URL**: Your domain
   - **Application Startup File**: `server.js`

### Install Dependencies (Automated)
**Option A: Use the automated setup script**
1. In NodeJS Selector terminal, run:
   ```bash
   bash cpanel-setup.sh
   ```
2. The script will handle dependency installation and build process

**Option B: Manual installation**
1. In NodeJS Selector, click **"Run NPM Install"**
2. If it fails, follow the troubleshooting steps below
3. The system will create a virtual environment and symlink

## Step 4: Environment Configuration

### Set Environment Variables
In NodeJS Selector, add these variables:
```
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=your-database-connection-string
```

**Important:** Replace `https://yourdomain.com` with your actual domain name.

### Database Setup
**For detailed database setup instructions, see [CPANEL_DATABASE_SETUP.md](./CPANEL_DATABASE_SETUP.md)**

1. **Quick Setup:**
   - Go to "MySQL Databases" in cPanel
   - Create database: `qiogems_db`
   - Create user with ALL PRIVILEGES
   - Note the full database name (with cPanel username prefix)

2. **Update DATABASE_URL** with your cPanel database credentials:
   ```env
   DATABASE_URL="mysql://cpanelusername_qiogems_user:password@localhost:3306/cpanelusername_qiogems_db"
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Step 5: Build and Start

### Build Application
In NodeJS Selector terminal:
```bash
npm run build
```

### Start Application
1. **Restart** the app in NodeJS Selector
2. **Check logs** for any errors
3. **Test** your application URL

## Step 6: SSL Configuration

1. **Enable SSL** in cPanel
2. **Update NEXTAUTH_URL** to use https://
3. **Restart** the application

## Troubleshooting

### Common Issues

**1. "node_modules" folder conflict**
- Ensure no `node_modules` folder exists in your app root
- Use NodeJS Selector to manage dependencies
- If error persists, delete any hidden node_modules and restart

**2. NPM Install Failures in CloudLinux NodeJS Selector**
- **Solution A**: Use the automated fix script (RECOMMENDED)
  ```bash
  # Run the comprehensive fix script
  bash fix-cpanel-nodemodules.sh
  ```
  This script will:
  - Remove any conflicting node_modules folders/symlinks
  - Remove package-lock.json that can cause conflicts
  - Clear npm cache
  - Install dependencies with proper symlink creation
  - Build the application

- **Solution B**: Use the simplified package.json
  ```bash
  # Remove package-lock.json first
  rm -f package-lock.json
  # Rename current package.json
  mv package.json package-original.json
  # Use the cPanel-optimized version
  mv package-cpanel.json package.json
  # Try npm install again in NodeJS Selector
  npm install --no-package-lock
  ```

- **Solution C**: Manual dependency installation
  ```bash
  # Remove package-lock.json and any node_modules
  rm -rf node_modules package-lock.json
  # In NodeJS Selector terminal, install core dependencies first:
  npm install --no-package-lock next@15.4.6 react@19.1.0 react-dom@19.1.0
  npm install --no-package-lock @prisma/client prisma
  npm install --no-package-lock next-auth
  # Then install remaining dependencies
  npm install --no-package-lock
  ```

- **Solution D**: Use yarn instead of npm
  ```bash
  # Remove npm lock files
  rm -f package-lock.json
  # Install yarn first
  npm install -g yarn
  # Then use yarn to install dependencies
  yarn install
  ```

**3. Build failures**
- Check Node.js version compatibility (use 16.x or 18.x)
- Verify all dependencies are installed
- Check error logs in NodeJS Selector
- Try building with: `npm run build --verbose`

**4. Database connection issues**
- Verify DATABASE_URL format
- Check database permissions
- Ensure database exists
- Run: `npx prisma generate` after dependency installation

**5. NextAuth issues**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure SSL is properly configured

### File Structure After Deployment
```
your-app/
├── server.js              # Custom server for CloudLinux
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies (start: "node server.js")
├── prisma/               # Database schema
├── src/                  # Application source
├── public/               # Static assets
├── node_modules -> /path/to/virtual/env  # Symlink (managed by NodeJS Selector)
└── .next/                # Built application
```

## Alternative: Subdomain Deployment

If main domain deployment fails:
1. **Create subdomain** (e.g., app.yourdomain.com)
2. **Point subdomain** to application folder
3. **Configure NodeJS Selector** for subdomain
4. **Update NEXTAUTH_URL** accordingly

## Support

If issues persist:
- Contact your hosting provider for CloudLinux-specific support
- Consider alternative hosting (Vercel, Netlify) for easier deployment
- Check cPanel error logs for detailed error information