// cPanel Node.js Application Configuration
// This file helps resolve 503 Service Unavailable errors

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Environment configuration for cPanel
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

// Memory optimization for cPanel
if (!process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = '--max-old-space-size=2048 --max-semi-space-size=128';
}

console.log('🚀 Starting cPanel Node.js Application');
console.log(`Environment: ${dev ? 'development' : 'production'}`);
console.log(`Hostname: ${hostname}`);
console.log(`Port: ${port}`);
console.log(`Node.js Version: ${process.version}`);
console.log(`Memory Options: ${process.env.NODE_OPTIONS}`);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Error handling for application startup
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Received SIGTERM, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('📴 Received SIGINT, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Start the application
app.prepare().then(() => {
    console.log('✅ Next.js app prepared successfully');
    
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('❌ Error handling request:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    });
    
    // Handle server errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${port} is already in use`);
            console.log('💡 Trying alternative ports...');
            
            // Try alternative ports
            const altPorts = [3001, 3002, 3003, 8080, 8081];
            let portIndex = 0;
            
            const tryNextPort = () => {
                if (portIndex < altPorts.length) {
                    const altPort = altPorts[portIndex++];
                    console.log(`🔄 Trying port ${altPort}...`);
                    
                    server.listen(altPort, (err) => {
                        if (err) {
                            console.error(`❌ Port ${altPort} failed:`, err.message);
                            tryNextPort();
                        } else {
                            console.log(`✅ Server running on http://${hostname}:${altPort}`);
                            console.log('🌐 Application is ready to serve requests');
                        }
                    });
                } else {
                    console.error('❌ No available ports found');
                    process.exit(1);
                }
            };
            
            tryNextPort();
        } else {
            console.error('❌ Server error:', err);
            process.exit(1);
        }
    });
    
    // Start listening on the specified port
    server.listen(port, (err) => {
        if (err) {
            console.error('❌ Failed to start server:', err);
            return;
        }
        
        console.log(`✅ Server running on http://${hostname}:${port}`);
        console.log('🌐 Application is ready to serve requests');
        console.log('');
        console.log('📋 Troubleshooting 503 errors:');
        console.log('1. Ensure cPanel Node.js app points to this directory');
        console.log('2. Set startup file to "cpanel-app-config.js"');
        console.log('3. Verify Node.js version compatibility');
        console.log('4. Check cPanel error logs for detailed information');
        console.log('5. Ensure all dependencies are installed');
    });
    
}).catch((err) => {
    console.error('❌ Failed to prepare Next.js app:', err);
    console.error('Stack:', err.stack);
    
    console.log('');
    console.log('🔧 Possible solutions:');
    console.log('1. Run: npm install --production');
    console.log('2. Run: npm run build');
    console.log('3. Check if all required dependencies are installed');
    console.log('4. Verify Next.js configuration');
    console.log('5. Run the fix-cpanel-deployment.sh script');
    
    process.exit(1);
});

// Health check endpoint for monitoring
const healthCheck = () => {
    console.log(`💓 Health check - ${new Date().toISOString()}`);
    console.log(`Memory usage: ${JSON.stringify(process.memoryUsage())}`);
};

// Run health check every 5 minutes
setInterval(healthCheck, 5 * 60 * 1000);

// Initial health check
healthCheck();