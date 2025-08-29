# cPanel 503 Service Unavailable - Troubleshooting Guide

## 🚨 Current Issue
You're experiencing a **503 Service Unavailable** error despite npm being installed. This indicates your Node.js application isn't running properly on cPanel.

## 🔍 Root Causes

### 1. Application Not Started
- Node.js app is configured but not running
- Startup file is incorrect or missing
- Application crashed during startup

### 2. Port Configuration Issues
- Default port (3000) might be blocked
- Port conflicts with other services
- cPanel proxy configuration problems

### 3. Memory/Resource Limitations
- Insufficient memory allocation
- Node.js process killed due to resource limits
- WebAssembly memory issues (as experienced before)

### 4. File/Directory Issues
- Application files in wrong directory
- Missing or corrupted dependencies
- Incorrect file permissions

## 🛠️ Step-by-Step Solutions

### Step 1: Verify cPanel Node.js Configuration

1. **Login to cPanel**
2. **Go to "Node.js Selector"**
3. **Check the following settings:**
   ```
   Node.js Version: 16.20.2 or 18.x (avoid 20.18.3 due to WASM issues)
   Application Mode: Production
   Application Root: public_html (or your app directory)
   Application URL: / (or your subdirectory)
   Startup File: cpanel-app-config.js
   ```

### Step 2: Upload and Configure Files

1. **Upload these new files to your cPanel file manager:**
   - `cpanel-app-config.js` (startup configuration)
   - `start-cpanel-app.sh` (startup script)
   - All package-cpanel-*.json files

2. **Set the startup file in cPanel Node.js Selector:**
   ```
   Startup File: cpanel-app-config.js
   ```

### Step 3: Install Dependencies

1. **Access cPanel Terminal or SSH**
2. **Navigate to your application directory:**
   ```bash
   cd ~/public_html
   ```

3. **Run the deployment fix script:**
   ```bash
   chmod +x fix-cpanel-deployment.sh
   ./fix-cpanel-deployment.sh
   ```

4. **Or manually install with memory optimization:**
   ```bash
   # Use ultra-low memory package if available
   cp package-cpanel-ultra-low-memory.json package.json
   
   # Install with memory limits
   NODE_OPTIONS="--max-old-space-size=1024" npm install --production
   
   # Build the application
   NODE_OPTIONS="--max-old-space-size=1024" npm run build
   ```

### Step 4: Start the Application

1. **Using the startup script:**
   ```bash
   chmod +x start-cpanel-app.sh
   ./start-cpanel-app.sh
   ```

2. **Or manually start:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=2048" node cpanel-app-config.js
   ```

### Step 5: Restart Node.js App in cPanel

1. **Go to cPanel Node.js Selector**
2. **Click "Restart" button**
3. **Wait 30-60 seconds**
4. **Check your website**

## 🔧 Advanced Troubleshooting

### Check Error Logs

1. **cPanel Error Logs:**
   - Go to cPanel → Error Logs
   - Look for Node.js related errors

2. **Application Logs:**
   ```bash
   # Check if app is running
   ps aux | grep node
   
   # Check port usage
   netstat -tulpn | grep :3000
   ```

### Memory Issues

If you're still getting memory errors:

1. **Use Prisma v2 (ultra-low memory):**
   ```bash
   cp package-cpanel-ultra-low-memory.json package.json
   npm install --production
   ```

2. **Reduce memory usage:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=32" npm start
   ```

### Port Configuration

If port 3000 is blocked:

1. **The cpanel-app-config.js will automatically try alternative ports:**
   - 3001, 3002, 3003, 8080, 8081

2. **Or manually specify a port:**
   ```bash
   PORT=8080 node cpanel-app-config.js
   ```

### File Permissions

```bash
# Fix file permissions
chmod 755 ~/public_html
chmod 644 ~/public_html/*.js
chmod 644 ~/public_html/*.json
chmod +x ~/public_html/*.sh
```

## 🎯 Quick Fix Commands

Run these commands in order:

```bash
# 1. Navigate to app directory
cd ~/public_html

# 2. Stop any existing processes
pkill -f "node.*next" 2>/dev/null || true

# 3. Use low-memory package
cp package-cpanel-ultra-low-memory.json package.json

# 4. Install dependencies
NODE_OPTIONS="--max-old-space-size=1024" npm install --production

# 5. Build application
NODE_OPTIONS="--max-old-space-size=1024" npm run build

# 6. Start with custom config
NODE_OPTIONS="--max-old-space-size=2048" node cpanel-app-config.js &

# 7. Restart cPanel Node.js app
echo "Now restart the Node.js app in cPanel Node.js Selector"
```

## ✅ Verification Steps

1. **Check if process is running:**
   ```bash
   ps aux | grep node
   ```

2. **Test the application:**
   ```bash
   curl -I http://localhost:3000
   ```

3. **Check cPanel Node.js status:**
   - Should show "Running" in Node.js Selector

4. **Access your website:**
   - Should load without 503 error

## 🆘 If Still Not Working

1. **Contact your hosting provider** - they may have specific Node.js restrictions
2. **Check cPanel documentation** for Node.js app requirements
3. **Consider using a different Node.js version** (16.x instead of 20.x)
4. **Verify hosting plan supports Node.js applications**

## 📞 Support Information

If you continue experiencing issues:

1. **Provide these details to support:**
   - Node.js version
   - Error logs from cPanel
   - Output of `ps aux | grep node`
   - Contents of package.json being used

2. **Common hosting provider solutions:**
   - Some providers require specific startup files
   - Port restrictions may apply
   - Memory limits might be lower than expected

---

**Remember:** The 503 error means the server can't handle the request, usually because the Node.js application isn't running or is misconfigured. Following these steps should resolve the issue.