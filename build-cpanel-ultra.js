#!/usr/bin/env node
// =============================================================================
// Ultra-Minimal cPanel Build Script for 4GB Memory Constraints
// =============================================================================
// This script implements extreme memory optimization techniques to build
// Next.js applications within cPanel's 4GB memory limit.
//
// Features:
// - Memory monitoring and cleanup
// - Chunked build process
// - WebAssembly disabling
// - Garbage collection forcing
// - Process memory limits
//
// Author: QioGems Development Team
// Version: 1.0 - Ultra Minimal
// =============================================================================

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Memory monitoring utilities
class MemoryMonitor {
  constructor() {
    this.maxMemoryMB = 3500; // Leave 500MB buffer from 4GB limit
    this.checkInterval = 5000; // Check every 5 seconds
    this.monitoring = false;
  }

  startMonitoring() {
    if (this.monitoring) return;
    this.monitoring = true;
    
    console.log('🔍 Starting memory monitoring...');
    
    this.interval = setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const rssUsedMB = Math.round(memUsage.rss / 1024 / 1024);
      
      console.log(`📊 Memory: Heap ${heapUsedMB}MB, RSS ${rssUsedMB}MB`);
      
      if (heapUsedMB > this.maxMemoryMB || rssUsedMB > this.maxMemoryMB) {
        console.log('⚠️  Memory limit approaching, forcing garbage collection...');
        if (global.gc) {
          global.gc();
        }
      }
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.monitoring = false;
      console.log('✅ Memory monitoring stopped');
    }
  }
}

// Build process manager
class UltraMinimalBuilder {
  constructor() {
    this.monitor = new MemoryMonitor();
    this.buildSteps = [
      'cleanup',
      'prepare',
      'build',
      'optimize',
      'finalize'
    ];
  }

  async cleanup() {
    console.log('🧹 Cleaning up previous builds...');
    
    const dirsToClean = ['.next', 'node_modules\\.cache', '.swc'];
    
    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        const command = process.platform === 'win32' ? `rmdir /s /q "${dir}"` : `rm -rf ${dir}`;
        try {
          await this.executeCommand(command);
          console.log(`   Cleaned: ${dir}`);
        } catch (error) {
          console.log(`   Skipped: ${dir} (not found or in use)`);
        }
      }
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
  }

  async prepare() {
    console.log('⚙️  Preparing ultra-minimal environment...');
    
    // Copy ultra-minimal config
    const configSource = 'next.config.cpanel-ultra-minimal.js';
    const configTarget = 'next.config.js';
    
    if (fs.existsSync(configSource)) {
      fs.copyFileSync(configSource, configTarget);
      console.log('   Ultra-minimal config activated');
    }
    
    // Set environment variables for minimal memory usage
    process.env.NODE_ENV = 'production';
    process.env.NODE_OPTIONS = '--max-old-space-size=3500 --no-experimental-fetch';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
    process.env.DISABLE_ESLINT_PLUGIN = 'true';
    process.env.GENERATE_SOURCEMAP = 'false';
    
    console.log('   Environment variables set for minimal memory usage');
  }

  async build() {
    console.log('🔨 Starting ultra-minimal build process...');
    
    const buildCommand = 'npx next build';
    
    try {
      await this.executeCommandWithMemoryLimit(buildCommand);
      console.log('✅ Build completed successfully');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  async optimize() {
    console.log('🚀 Optimizing build output...');
    
    // Remove unnecessary files from .next directory
    const unnecessaryPaths = [
      '.next\\cache',
      '.next\\static\\development',
    ];
    
    for (const path of unnecessaryPaths) {
      if (fs.existsSync(path)) {
        const command = process.platform === 'win32' ? `rmdir /s /q "${path}"` : `rm -rf ${path}`;
        try {
          await this.executeCommand(command);
          console.log(`   Removed: ${path}`);
        } catch (error) {
          console.log(`   Skipped: ${path} (not found)`);
        }
      }
    }
  }

  async finalize() {
    console.log('🎯 Finalizing deployment...');
    
    // Create deployment info
    const deploymentInfo = {
      buildTime: new Date().toISOString(),
      configuration: 'ultra-minimal',
      memoryOptimized: true,
      webAssemblyDisabled: true,
      version: '1.0'
    };
    
    fs.writeFileSync('.next/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('   Deployment info created');
    
    console.log('✅ Ultra-minimal build process completed successfully!');
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async executeCommandWithMemoryLimit(command) {
    return new Promise((resolve, reject) => {
      // Set memory limit environment variables
      const env = {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=3500 --no-experimental-fetch --expose-gc',
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
        DISABLE_ESLINT_PLUGIN: 'true',
        GENERATE_SOURCEMAP: 'false'
      };
      
      // Use exec for npx commands
      const { exec } = require('child_process');
      const child = exec(command, {
        env,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      child.stdout.on('data', (data) => {
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  async run() {
    console.log('🚀 Starting Ultra-Minimal cPanel Build Process');
    console.log('=' .repeat(60));
    
    this.monitor.startMonitoring();
    
    try {
      for (const step of this.buildSteps) {
        console.log(`\n📋 Step: ${step.toUpperCase()}`);
        await this[step]();
        
        // Force garbage collection between steps
        if (global.gc) {
          global.gc();
        }
        
        // Small delay to allow memory cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('\n🎉 Ultra-minimal build completed successfully!');
      console.log('   Ready for cPanel deployment');
      
    } catch (error) {
      console.error('\n❌ Build process failed:', error.message);
      process.exit(1);
    } finally {
      this.monitor.stopMonitoring();
    }
  }
}

// Run the ultra-minimal builder
if (require.main === module) {
  const builder = new UltraMinimalBuilder();
  builder.run().catch(console.error);
}

module.exports = UltraMinimalBuilder;